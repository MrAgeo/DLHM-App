import tensorflow as tf
from tensorflow.keras.backend import tanh
import numpy as np
#from skimage.io import imread
import cv2
import math

__all__ = ("RegressionSequence", "Rotate90Randomly", "Fourier2D")

class RegressionSequence(tf.keras.utils.Sequence):
    def __init__(self, x, y, d_path, b_size):
        self.x, self.y = x, y
        self.batch_size = b_size
        self.dir = d_path

    def __len__(self):
        return math.ceil(len(self.x) / self.batch_size)

    def __getitem__(self, idx):
        batch_x = self.x[idx * self.batch_size:(idx + 1) * self.batch_size]
        batch_y = self.y[idx * self.batch_size:(idx + 1) * self.batch_size]

        return np.array([
            #imread(f"{self.dir}/{file_name.split('_')[0]}/{file_name}", as_gray=True)
            cv2.imread(f"{self.dir}/{file_name.split('_')[0]}/{file_name}", cv2.IMREAD_GRAY)
            for file_name in batch_x]), np.array(batch_y)


# Perform data augmentation on holograms (Only 90°, 180° and 270° rotations)
class Rotate90Randomly(tf.keras.layers.experimental.preprocessing.PreprocessingLayer):

    @staticmethod
    def call(x, training=False):
        def random_rotate():
            rotation_factor = tf.random.uniform([], minval=0, maxval=4, dtype=tf.int32)
            return tf.image.rot90(x, k=rotation_factor)

        training = tf.constant(training, dtype=tf.bool)

        rotated = tf.cond(training, random_rotate, lambda: x)
        rotated.set_shape(rotated.shape)
        return rotated


# Add Fourier transform to the tensor
class Fourier2D(tf.keras.layers.experimental.preprocessing.PreprocessingLayer):

    @staticmethod
    def call(x: tf.Tensor):

        def fourier(hologram):
            return tf.concat([
                tf.math.real(hologram),
                tf.expand_dims(tf.abs(tf.signal.fftshift(tf.signal.fft2d(hologram[:, :, 0]))), -1)],
                axis=-1
            )  # Use the hologram and the log abs fourier transform

        return tf.vectorized_map(fourier, x)  # Performs tf ops in max parallelism


# Custom activation function to limit regression output possibilities
def holo(d, target_min=0.1, target_max=10):
    d = tanh(d) + 1  # x in range(0,2)
    scale = (target_max - target_min) / 2.
    return d * scale + target_min
