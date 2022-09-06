# -*- coding: utf-8 -*-
"""Digital in-Line Holography Microscopy Library.

First version: Maria J Lopera (2018)
Second version (this file): Sergio Jurado Torres (2022)

All functions were adapted from Juan Pablo Piedrahita Quintero, Jorge Garcia Sucerquia & John Restrepo's MATLAB code.
"""

import numpy as np
import os

# from pyfftw.interfaces.scipy_fft import fft2, ifft2, ifftn
from scipy.fft import fft2 as _fft2, ifft2 as _ifft2, fftshift, ifftshift
from math import sqrt, sin , atan, ceil
from numpy import pi

pwd = os.getcwd()

__all__ = ('propagate', 'kreuzer3F', 'prepairholoF', 'filtcosF', 'point_src','bluestein3', \
    'holo_interpF', 'dlhm_sim', 'fb_reconstruct', 'fb_reconstruct2', 'as_reconstruct', 'angular_spectrum') 

def propagate(field, L, z, wavelength, dx_in, dx_out):
    """ Propagate a complex field with the Bluestein transform for high Numerical Aperture,
    and then interpolate the output throug.
        out = propagate(field, z, wavelength, dx, dxout )
    
    # Arguments
        field (np.ndarray): Input complex field.
        z (float): Propagation distance.
        wavelength (float): Wavelength.
        dx_in (float or iterable): Input pixel pitch.
                                   If dx_in is a float, then dy_in = dx_in;
                                   Else, the iterable is assumed as (dx_in, dy_in).
        dx_out (float or iterable): Output pixel pitch.
                                   If dx_out is a float, then dy_out = dx_out;
                                   Else, the iterable is assumed as (dx_out, dy_out).
    
    # Returns
        A numpy array representing the diffracted field.
    """
    out = bluestein3(field,z, wavelength, dx_in, dx_out)
    return holo_interpF(out, wavelength, L-z, dx_out)


def kreuzer3F(CH_m, z, L, wavelength, deltax, deltaX, CF, fname=None):
    """Function to reconstruct an in-line hologram with the methodology from the
    Jürgen Kreuzer's patent (US6411406B1).
    
    # Arguments
        CH_m (numpy.ndarray): The contrast hologram.
        z (float): Source to sample distance.
        L (float): Source to camera distance.
        wavelength (float): Wavelength.
        deltax (float or iterable): Hologram plane pixel pitch (real pixel size).
                                    If deltax is a float, then deltay = deltax;
                                    Else, the iterable is assumed as (deltax, deltay).
        deltaX (float or iterable): Object plane pixel pitch.
                                    If deltaX is a float, then deltaY = deltaX;
                                    Else, the iterable is assumed as (deltaX, deltaY).
        CF (numpy.ndarray): Cosine filter matrix.
        fname (str): (Optional) File name of the saved prepared hologram. It will be loaded
                     through numpy's load() function.
    # Returns
        A numpy array representing the reconstructed hologram.
    """
    if isinstance(deltaX, (tuple,list)):
        deltaY = deltaX[1]
        deltaX = deltaX[0]
    else:
        ## Square pixels
        deltaY = deltaX

    if isinstance(deltax, (tuple,list)):
        deltay = deltax[1]
        deltax = deltax[0]
    else:
        ## Square pixels
        deltay = deltax

    ## Matrix size
    n_rows, n_cols = CH_m.shape

    ## Padding constant value
    padx = n_cols//2
    pady = n_rows//2

    ## Parameters
    k = 2*pi/wavelength
    Wx = deltax*n_cols
    Wy = deltay*n_rows

    ## Matrix coordinates
    Y, X = np.mgrid[:n_rows,:n_cols] # mgrid magic

    ## Hologram origin coordinates
    xo = -Wx/2
    yo = -Wy/2

    ## Prepared Hologram, coordinates origin
    xop = xo * L/sqrt(L**2 + xo**2)
    yop = yo * L/sqrt(L**2 + yo**2)

    ## Pixel size for the prepared hologram
    deltaxp = -xop/padx
    deltayp = -yop/pady

    ## Coordinates origin for the reconstruction plane
    Xo = -deltaX*padx
    Yo = -deltaY*pady

    Xp = (deltax)*(X-padx)*L/np.emath.sqrt(L**2 + (deltax**2)*(X-padx)**2 + (deltay**2)*(Y-pady)**2)
    Yp = (deltay)*(Y-pady)*L/np.emath.sqrt(L**2 + (deltax**2)*(X-padx)**2 + (deltay**2)*(Y-pady)**2)

    ## Search for prepared hologram if needed
    if fname:
        ## Preparation of the hologram when necessary
        if os.path.isfile(fname):
            ## load file with the saved prepared hologram
            CHp_m = np.load(fname)
        else:
            ## Prepare holo
            CHp_m = prepairholoF(CH_m,xop,yop,Xp,Yp)
            # np.save(fname, CHp_m)
    else:
        CHp_m = prepairholoF(CH_m,xop,yop,Xp,Yp)
        
    ## Multiply prepared hologram with propagation phase

    Rp = np.emath.sqrt((L**2)-(deltaxp*X+xop)**2-(deltayp*Y+yop)**2)
    # old r = np.emath.sqrt((deltaX**2)*((X-padx)**2+(Y-pady)**2) + (z)**2)
    r = np.emath.sqrt( ((deltaX**2) * (X-padx)**2 + (deltaY**2) * (Y-pady)**2 ) + z**2) 
    CHp_m = CHp_m*((L/Rp)**4)*np.exp(-0.5*1j*k*(r**2 - 2*z*L)*Rp/(L**2))
        #*np.exp(0.125*1j*k*((L**2)/Rp)*((r**2 - 2*z*L)*(Rp/(L**2))**2)**2) \
        #*np.exp(-(3/48)*1j*k*((L**2)/Rp)*((r**2 - 2*z*L)*(Rp/(L**2))**2)**3) \
        #*np.exp((15/384)*1j*k*((L**2)/Rp)*((r**2 - 2*z*L)*(Rp/(L**2))**2)**4)

    ## Padding on the cosine filter
    CF = np.pad(CF, ((padx,),(pady,)), "constant")

    ## Convolution operation
    ## First transform
    T1 = CHp_m*np.exp((1j*k/(2*L))*( 2*Xo*X*deltaxp + 2*Yo*Y*deltayp + (X)**2*deltaxp*deltaX + (Y)**2*deltayp*deltaY))
    T1 = np.pad(T1, ((padx,),(pady,)), "constant")
    T1 = fft2(T1*CF)

    ## Second transform
    T2 = np.exp(-1j*(k/(2*L))*((X-padx)**2*deltaxp*deltaX + (Y-pady)**2*deltayp*deltaY))
    T2 = np.pad(T2, ((padx,),(pady,)), "constant")
    T2 = fft2(T2*CF)

    ## Third transform
    K = ifft2(T2*T1)

    ## Multiply by additional terms after the propagation
    ##  K = K*deltaxp*deltayp*(np.exp(np.emath.sqrt(-1)*(k/L)*((Xo+X*deltaX)*xop+(Yo+Y*deltaY)*yop)))...
    ##      *np.exp(np.emath.sqrt(-1)*(0.5*k/L)*((X-0*pad)**2*deltaxp*deltaX + (Y-0*pad)**2*deltayp*deltaY))

    return K[pady:pady+n_rows,padx:padx+n_cols]


def prepairholoF(CH_m, xop, yop, Xp, Yp):
    """User function to prepare the hologram using nearest neighbor interpolation strategy.
    
    # Arguments
        CH_m (numpy.ndarray): The hologram.
        xop (float): X coordinate origin.
        yop (float): Y coordinate origin.
        Xp (numpy.ndarray): X plane mesh.
        Yp (numpy.ndarray): Y plane mesh.
    
    # Returns
        A numpy array representing the prepared hologram.
    """
    n_rows, n_cols = CH_m.shape

    ## New coordinates measured in units of the -2*xop/(n_rows) pixel size
    Xcoord = (Xp - xop)/(-2*xop/(n_rows))
    Ycoord = (Yp - yop)/(-2*xop/(n_rows))

    ## Find lowest integer
    iXcoord = np.floor(Xcoord).astype(np.intp)
    iYcoord = np.floor(Ycoord).astype(np.intp)
    
    ## Assure there isn't last pixel positions
    iXcoord[iXcoord==n_cols-1] -= 1
    iYcoord[iYcoord==n_rows-1] -= 1

    ##  Calculate the fractioning for interpolation
    x1frac = (iXcoord + 1.0) - Xcoord                ## upper value to integer
    x2frac = 1.0 - x1frac                            ## lower value to integer
    y1frac = (iYcoord + 1.0) - Ycoord
    y2frac = 1.0 - y1frac

    x1y1 = x1frac * y1frac                          ## Corresponding pixel areas for each direction
    x1y2 = x1frac * y2frac
    x2y1 = x2frac * y1frac
    x2y2 = x2frac * y2frac

    ## Pre-allocate the prepared hologram
    CHp_m = np.zeros((n_rows, n_cols), dtype=complex)

    ## Prepare hologram (preparation1 - every pixel remapping)
    CHp_m[iYcoord,iXcoord] = CHp_m[iYcoord,iXcoord] + x1y1 * CH_m
    CHp_m[iYcoord,iXcoord+1] = CHp_m[iYcoord,iXcoord+1] + x2y1 * CH_m
    CHp_m[iYcoord+1,iXcoord] = CHp_m[iYcoord+1,iXcoord] + x1y2 * CH_m
    CHp_m[iYcoord+1,iXcoord+1] = CHp_m[iYcoord+1,iXcoord+1] + x2y2 * CH_m
    
    return CHp_m
    

def filtcosF(par,M):
    """Create a cosine filter.
    
    CF = filtcosF(par, M, fig_num)
    
    # Arguments
        par (float): Size parameter
        M (int or iterable): Matrix size (rows or rows,cols).
                             If M is an int, then N = M;
                             Else, the iterable is assumed as (M,N).
    
    # Returns
        A rescaled numpy array from 0 to 1 with the filter.
    """
    
    if isinstance(M, (tuple, list)):
        N = M[1] 
        M = M[0]
    else:
        N = M
    
    ## Coordinates
    Xfc, Yfc = np.meshgrid(np.linspace(-N/2,N/2,N), np.linspace(M/2,-M/2,M))

    ## Normalize coordinates in the range (-pi, pi) and
    ## create vertical and horizontal filters
    CF1 = np.cos(Xfc*(pi/par)*(1/np.max(Xfc)))**2 
    CF2 = np.cos(Yfc*(pi/par)*(1/np.max(Yfc)))**2

    ## Intersect both directions
    CF = (CF1>0)*(CF1)*(CF2>0)*(CF2)

    ## Rescale from 0 to 1
    CF = CF/np.max(CF)

    return CF


def point_src(M, z, x0, y0, wavelength, dx, dy=None):
    """Function to create a point source illumination centered in
    (x0,y0) and observed in a plane at a distance z.
        
        P = point_src(M,z,x0,y0,wavelength,dx)
    
    # Arguments    
        M (int or iterable): Matrix size (rows or rows,cols).
                             If M is an int, then N = M;
                             Else, the iterable is assumed as (M,N).
        z (float): Screen distance.
        x0 (float): X center coordinate.
        y0 (float): Y center coordinate.
        wavelength (float): Wavelength.
        dx (float): Sampling pitch in X.
        dy (float): (Optional) Sampling pitch in Y.
                    If none is given, then dy = dx.
    
    # Returns
        A numpy array representing the observed field.
    """
    
    if isinstance(M, (tuple, list)):
        N = M[1] 
        M = M[0]
    else:
        N = M
    
    dy = dx if dy is None else dy

    m, n = np.mgrid[1-M/2:M/2+1, 1-N/2:N/2+1] # mgrid magic

    k = 2 * pi / wavelength
    r = np.emath.sqrt(z**2 + (n*dx - x0)**2 + (m*dy - y0)**2)

    return np.exp(1j * k * r) / r


def bluestein3(field,z, wavelength, dx_in, dx_out):
    """Bluestein transform for high Numerical Aperture.
    This function performs the high-NA diffraction calculation using the
    methodology presented in doi:10.1364/AO.50.001745. After the
    calculation, interpolation with the function holo_interpF is needed.
    
        out = bluestein3(field, z, wavelength, dx, dxout )
    
    # Arguments
        field (np.ndarray): Input complex field.
        z (float): Propagation distance.
        wavelength (float): Wavelength.
        dx_in (float or iterable): Input pixel pitch.
                                   If dx_in is a float, then dy_in = dx_in;
                                   Else, the iterable is assumed as (dx_in, dy_in).
        dx_out (float or iterable): Output pixel pitch.
                                   If dx_out is a float, then dy_out = dx_out;
                                   Else, the iterable is assumed as (dx_out, dy_out).
    
    # Returns
        A numpy array representing the diffracted field.
    """
    M, N = field.shape # rows, cols
    
    m, n = np.mgrid[1-M/2:M/2+1, 1-N/2:N/2+1] # mgrid magic

    pady = M//2
    padx = N//2
    
    if isinstance(dx_in,(tuple, list)):
        dy_in = dx_in[1]
        dx_in = dx_in[0]
    else:
        dy_in = dx_in
        
    if isinstance(dx_out,(tuple, list)):
        dy_out = dx_out[1]
        dx_out = dx_out[0]
    else:
        dy_out = dx_out

    dX = dx_out / np.emath.sqrt(1 - (dx_out / z)**2 * (m**2 + n**2))
    dY = dy_out / np.emath.sqrt(1 - (dy_out / z)**2 * (m**2 + n**2))

    k = 2 * pi / wavelength
    R = np.emath.sqrt(z**2 + (n * dX)**2 + (m * dY)**2)

    out_phase = 1 / (1j * wavelength * R) * np.exp(1j * k * R) * \
                np.exp(-1j * 0.5 * k / R * ((dx_in * dX * n**2) + (dy_in * dY * m**2)))

    f1 = field * np.exp(1j * 0.5 * k / R * ((dx_in * (dx_in - dX) * n**2) + (dy_in * (dy_in - dY) * m**2)))
    f2 = np.exp(1j * 0.5 * k / R * ((dx_in * dX * n**2) + (dy_in * dY * m**2)))

    ##                                     (add rows, add cols)
    F1 = fftshift(fft2(fftshift(np.pad(f1, ((pady,), (padx,)), "constant" ))))
    F2 = fftshift(fft2(fftshift(np.pad(f2, ((pady,), (padx,)), "constant" ))))

    out = ifftshift(ifft2(ifftshift(F1 * F2)))
    
    return out_phase * out[pady:pady+M,padx:padx+N]


def holo_interpF(mtx_in, wavelength, z, deltax):
    """Function to interpolate the hologram applying the coordinates
    transformation after the fresnel-bluestein transform. The algorithm is
    somehow similar to the nearest neighbor interpolator.
        out = holo_interpF(mtx_in, wavelength, z, deltax)
        
    # Arguments
        mtx_in (np.ndarray): Input complex field.
        z (float): Propagation distance.
        wavelength (float): Wavelength.
        deltax (float or iterable): Object plane pixel pitch.
                                    If deltax is a float, then deltay = deltax;
                                    Else, the iterable is assumed as (deltax, deltay).
        
    # Returns
        A numpy array representing the interpolated hologram.
    """
    ## Necessary parameters
    n_rows, n_cols = mtx_in.shape
    
    if isinstance(deltax,(tuple, list)):
        deltay = deltax[1]
        deltax = deltax[0]
    else:
        deltay = deltax
    
    ## Coordinates transformation required
    Xc, Yr = np.meshgrid(np.linspace(0,n_cols,n_cols), np.linspace(0,n_rows,n_rows))
    X = deltax*(Xc - n_cols/2)/(wavelength*z)
    Y = deltay*(Yr - n_rows/2)/(wavelength*z)
    Xp = wavelength*X*z/np.emath.sqrt(1-(wavelength**2)*(X**2+Y**2))
    Yp = wavelength*Y*z/np.emath.sqrt(1-(wavelength**2)*(X**2+Y**2))

    ## Length of the coordinates matrix in pixels
    limitX = ceil(np.max(Xp/deltax))
    limitY = ceil(np.max(Yp/deltay))

    ## Displace the origin of coordinates
    Xp = Xp - np.min(Xp)
    Yp = Yp - np.min(Yp)

    ## Coordinates in pixel units
    Xp_p = Xp/deltax
    Yp_p = Yp/deltay

    ## Positions to asign the displacement values
    iXp = np.floor(Xp_p).astype(np.intp)
    iYp = np.floor(Yp_p).astype(np.intp)
    
    ## Assure there isn't last pixel positions
    iXp[iXp==2*limitX-1] -= 1
    iYp[iYp==2*limitY-1] -= 1

    ## Calculate the weights for the neares
    x1frac = (iXp + 1.0) - Xp_p                ## upper value to integer
    x2frac = 1.0 - x1frac                      ## lower value to integer
    y1frac = (iYp + 1.0) - Yp_p
    y2frac = 1.0 - y1frac

    x1y1 = x1frac*y1frac                  ## Corresponding pixel areas for each direction
    x1y2 = x1frac*y2frac
    x2y1 = x2frac*y1frac
    x2y2 = x2frac*y2frac

    ## Pre-allocate the interpolated hologram
    mtx_out = np.zeros((2*limitY,2*limitX), dtype=complex)
    
    ## Interpolation process
    mtx_out[iYp,iXp] = mtx_out[iYp,iXp] + x1y1 * mtx_in
    mtx_out[iYp,iXp+1] = mtx_out[iYp,iXp+1] + x2y1 * mtx_in
    mtx_out[iYp+1,iXp] = mtx_out[iYp+1,iXp] + x1y2 * mtx_in
    mtx_out[iYp+1,iXp+1] = mtx_out[iYp+1,iXp+1] + x2y2 * mtx_in
    
    ## Crop to the size of the camera
    selec = slice((2*limitY - n_rows)//2 + 1, (2*limitX + n_cols)//2 + 1)
    
    return mtx_out[selec,selec]


def dlhm_sim(object,z,L,wavelength,dx,*args, output_mask=0xF):
    """Function to simulate inline holograms.
    This function simulates DLHM holograms using the methodology presented
    in doi:10.1364/AO.50.001745, it receives the geometrical parameters as
    inputs.
    
        hologram, reference, contrast, NA = dlhm_sim(object, wavelength, z, L, dx)
    
    # Arguments
      object (numpy.ndarray): Object to use as a sample, can be complex.
      z (float): Source to sample distance.
      L (float): Source to camera distance.
      wavelength (float): Wavelength.
      dx (float): Hologram plane pixel pitch on X.
      dy (float): (Optional) Hologram plane pixel pitch on Y.
                  If None is given, then dy=dx.
      output_mask (int): (Optional) A binary mask indicating which output should dlhm_sim return:
                         1 for the hologram, 2 for the reference wave,
                         4 for the contrast and 8 for the numerical aperture.
                         Default: 15 (return all).
    
    # Returns
        A list containing the outputs according to output_mask.
        Output order:  hologram, reference, contrast hologram, numerical aperture.
    """
    
    dy = args[0] if args else dx

    ## Object size
    M, N = object.shape

    ## Numerical aperture
    NA = sin(atan(0.5 * dx * M / L))
    if args:
        NAy = sin(atan(0.5 * dy * N / L))

    ## Pixel size at sample plane
    dxo = dx * z / L
    dyo = dy * z / L

    ## Function parameters
    params = ((dxo,dyo),(dx,dy)) if args else (dxo,dx)

    ## Reference at sample plane
    ref_smp = point_src(M,z,0,0,wavelength,params[0])
    
    ## Propagation
    ## Hologram, reference and contrast hologram
    if output_mask & 5: # hologram or contrast
        holo_field = bluestein3(object * ref_smp, L-z, wavelength, *params)
        holo = np.abs(holo_field)**2
    else:
        holo = None

    if output_mask & 6: # reference or contrast
        ref_field = bluestein3(ref_smp, L-z, wavelength, *params)
        ref = np.abs(ref_field)**2
    else:
        ref = None

    if output_mask & 4: # contrast
        c_holo = holo - ref
    else:
        c_holo = None

    ## Outputs
    outs = []
    
    ## Interpolate hologram coordinates
    for x in (holo, ref, c_holo):
        if output_mask & 1:
            res = holo_interpF(x, wavelength, L-z, params[1])            
            outs.append(res)
        output_mask >>= 1

    if output_mask:
        outs.append((NA, NAy) if args else NA)


    # hologram = holo
    # reference = ref
    # contrast = c_holo
    return outs


## TODO: Unify XX_reconstruct params
def fb_reconstruct(holoC, z, L, x, wavelength):
    """Function to reconstruct an in-line hologram with the methodology from the
    Jürgen Kreuzer's patent (US6411406B1), via the Fresnel-Bluestein transform.
    
    # Arguments
        holoC (numpy.ndarray): The contrast hologram.
        z (float): Source to sample distance.
        L (float): Source to camera distance.
        x (float or iterable): Camera sensor side's length.
                               If x is a float, then height = width;
                               Else, the iterable is assumed as (width, height).
        wavelength (float): Wavelength.
    
    # Returns
        A numpy array representing the reconstructed hologram.
    """
    if isinstance(x, (tuple, list)):
        zL = z / L
    
        #(x,y)
        dx = ( x[0] / holoC.shape[1], x[1] / holoC.shape[0])
        dxo = ( dx[0] * zL, dx[1] * zL)
    else:
        ## Pixel size at sample plane
        dx = x / holoC.shape[1]
        dxo = dx * z / L

    return kreuzer3F(holoC, z, L, wavelength, dx, dxo, filtcosF(100, holoC.shape[0]))


def fb_reconstruct2(holoC, z, L, dx, wavelength):
    """Function to reconstruct an in-line hologram with the methodology from the
    Jürgen Kreuzer's patent (US6411406B1), via the Fresnel-Bluestein transform.
    
    # Arguments
        holoC (numpy.ndarray): The contrast hologram.
        z (float): Source to sample distance.
        L (float): Source to camera distance.
        dx (float or iterable): Hologram plane pixel pitch (real pixel size).
                                If dx is a float, then dy = dx;
                                Else, the iterable is assumed as (dx,dy).
        wavelength (float): Wavelength.
    # Returns
        A numpy array representing the reconstructed hologram.
    """
    zL = z / L

    ## Pixel size at sample plane
    #(x,y)
    dxo = ( dx[0] * zL, dx[1] * zL) if isinstance(dx, (tuple, list)) else dx * zL
    return kreuzer3F(holoC, z, L, wavelength, dx, dxo, filtcosF(100, holoC.shape[0]))


def as_reconstruct(holo, ref, dx, wavelength, z):
    """Function to reconstruct a hologram via the Angular Spectrum method.
    
    # Arguments
        holo (numpy.ndarray): The recorded hologram.
        ref (numpy.ndarray): The reference wave.
        dx (float or iterable): Hologram plane pixel pitch (real pixel size).
                                If dx is a float, then dy = dx;
                                Else, the iterable is assumed as (dx,dy).
        wavelength (float): Wavelength.
        z (float): The reconstruction distance.
        
    # Returns
        A numpy array representing the reconstructed hologram.
    """
    k = (2 * pi) / wavelength
    holo = np.abs(holo)
    ref = np.abs(ref)
    
    return angular_spectrum(holo - ref, k, dx, z)


def angular_spectrum(u0, k, dx, z):
    """Function to propagate a wavefield via the Angular Spectrum method.
    
    # Arguments
        u0 (numpy.ndarray): The wavefield to propagate.
        k (float): The propagation number (2*pi/lambda).
        dx (float or iterable): Hologram plane pixel pitch (real pixel size).
                                If dx is a float, then dy = dx;
                                Else, the iterable is assumed as (dx,dy).
        z (float): The reconstruction distance.
        
    # Returns
        A numpy array representing the propagated wavefield.
    """
    if isinstance(dx,(tuple, list)):
        dy = dx[1]
        dx = dx[0]
    else:
        dy = dx

    M, N = u0.shape # rows, cols

    dfy = 1 / (M * dy)
    dfx = 1 / (N * dx)
    
    # n/2 * dfx = 1/2 * 1/dx
    lim_x = 0.5/dx
    lim_y = 0.5/dy
    
    m, n = np.mgrid[-lim_y:lim_y:dfy, -lim_x:lim_x:dfx]

    e = np.exp((1j * z * np.emath.sqrt((k**2 - 4*np.pi**2 * (n**2 + m**2)))))
    return ifft2(fft2(u0) * e)


def fft2(x):
    """Function to obtain the 2D Discrete Fourier Transform via the FFT.
    It includes two fftshifts: one before and one after applying the original FFT2 algorithm to x.
    
    # Arguments
        x (numpy.ndarray): The input array.
    
    # Returns
        A numpy array with the result after applying the fftshifts and the 2D FFT.
    """
    return fftshift(_fft2(fftshift(x)))


def ifft2(x):
    """Function to obtain the 2D Inverse Discrete Fourier Transform via the IFFT.
    It includes two ifftshifts: one before and one after applying the original IFFT2 algorithm to x.
    
    # Arguments
        x (numpy.ndarray): The input array.
    
    # Returns
        A numpy array with the result after applying the ifftshifts and the 2D IFFT.
    """
    return ifftshift(_ifft2(ifftshift(x)))