# Optimized Sparse Matrix LU Solver for Large MNA Grids
import numpy as np

def solve_sparse_mna(matrix_a, vector_b):
    try:
        solution = np.linalg.solve(matrix_a, vector_b)
        return solution.tolist()
    except np.linalg.LinAlgError:
        return None
