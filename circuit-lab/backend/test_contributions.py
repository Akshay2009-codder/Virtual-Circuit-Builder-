import unittest
import math
import time
from rate_limiter import TokenBucketRateLimiter


def generate_sine_wave(t, amplitude, frequency, phase_offset=0, dc_offset=0):
    return dc_offset + amplitude * math.sin(2 * math.pi * frequency * t + phase_offset)


def generate_square_wave(t, amplitude, frequency, duty_cycle=0.5, dc_offset=0):
    if frequency <= 0:
        return dc_offset
    period = 1.0 / frequency
    time_in_period = (t % period + period) % period
    is_high = (time_in_period / period) < duty_cycle
    return dc_offset + (amplitude if is_high else -amplitude)


class TestWaveformGenerator(unittest.TestCase):
    def test_sine_wave_peak_and_zero_crossing(self):
        # 1 Hz wave, amp 5.0
        v_zero = generate_sine_wave(0.0, 5.0, 1.0)
        v_peak = generate_sine_wave(0.25, 5.0, 1.0)
        
        self.assertAlmostEqual(v_zero, 0.0, places=5)
        self.assertAlmostEqual(v_peak, 5.0, places=5)

    def test_square_wave_duty_cycle(self):
        # 1 Hz square wave, 50% duty cycle, 3.3V amp
        v_high = generate_square_wave(0.1, 3.3, 1.0, duty_cycle=0.5)
        v_low = generate_square_wave(0.7, 3.3, 1.0, duty_cycle=0.5)

        self.assertEqual(v_high, 3.3)
        self.assertEqual(v_low, -3.3)


class TestRateLimiter(unittest.TestCase):
    def test_rate_limiter_quota_exhaustion(self):
        # 60 req/min = 1 req/sec capacity
        limiter = TokenBucketRateLimiter(requests_per_minute=3)
        ip = "192.168.1.100"

        self.assertTrue(limiter.is_allowed(ip))
        self.assertTrue(limiter.is_allowed(ip))
        self.assertTrue(limiter.is_allowed(ip))
        # 4th immediate request should be rejected
        self.assertFalse(limiter.is_allowed(ip))


if __name__ == "__main__":
    unittest.main()
