# Modified Nodal Analysis (MNA) Circuit Solver Engine

## Theory & Overview

The backend simulation engine relies on **Modified Nodal Analysis (MNA)** to solve for node voltages $V$ and branch currents $I$ across arbitrary DC circuit topologies.

The MNA system equation takes the form:

$$
\begin{bmatrix}
\mathbf{G} & \mathbf{B} \\
\mathbf{C} & \mathbf{D}
\end{bmatrix}
\begin{bmatrix}
\mathbf{v} \\
\mathbf{j}
\end{bmatrix}
=
\begin{bmatrix}
\mathbf{i} \\
\mathbf{e}
\end{bmatrix}
$$

Where:
- $\mathbf{G}$: Conductance matrix derived from passive resistors ($G = 1/R$).
- $\mathbf{B}, \mathbf{C}$: Voltage source incidence matrices mapping independent/dependent voltage sources to circuit nodes.
- $\mathbf{D}$: Zero matrix for ideal independent voltage sources.
- $\mathbf{v}$: Vector of unknown node voltages relative to reference ground ($V_0 = 0\text{ V}$).
- $\mathbf{j}$: Vector of currents flowing through voltage sources.
- $\mathbf{i}$: Independent current source injections.
- $\mathbf{e}$: Independent voltage source values.

## Supported Electrical Components

1. **Independent Voltage Sources** (`dc_power`, `battery`): Sets fixed node potential $V = V_{\text{source}}$.
2. **Resistors** (`resistor`, `potentiometer`): Contributes conductance $g = 1/R$ to node pairs.
3. **LEDs** (`led_red`, `led_green`, `led_blue`, `led_yellow`): Modeled with forward voltage drop $V_f$ and series internal resistance $R_d$.
4. **Diodes** (`diode_1n4007`): Shockley diode model equation linearized around operating points.
5. **Switches & Pushbuttons**: Dynamically toggled between open-circuit resistance ($10^9 \, \Omega$) and closed resistance ($10^{-3} \, \Omega$).
6. **Microcontroller Pins**: Simulated as digital output voltage sources ($3.3\text{V} / 5\text{V}$) or high-impedance inputs.
