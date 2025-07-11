import numpy as np
import matplotlib.pyplot as plt
import matplotlib.animation as animation
from scipy.integrate import solve_ivp

# Physical constants
g = 9.81
L1 = 1.0
L2 = 1.0
m1 = 1.0
m2 = 1.0

# Equations of motion
def double_pendulum_derivs(t, y):
    theta1, z1, theta2, z2 = y

    delta = theta2 - theta1

    den1 = (m1 + m2) * L1 - m2 * L1 * np.cos(delta) ** 2
    den2 = (L2 / L1) * den1

    dtheta1 = z1
    dz1 = (m2 * L1 * z1**2 * np.sin(delta) * np.cos(delta) +
           m2 * g * np.sin(theta2) * np.cos(delta) +
           m2 * L2 * z2**2 * np.sin(delta) -
           (m1 + m2) * g * np.sin(theta1)) / den1

    dtheta2 = z2
    dz2 = (-m2 * L2 * z2**2 * np.sin(delta) * np.cos(delta) +
           (m1 + m2) * g * np.sin(theta1) * np.cos(delta) -
           (m1 + m2) * L1 * z1**2 * np.sin(delta) -
           (m1 + m2) * g * np.sin(theta2)) / den2

    return [dtheta1, dz1, dtheta2, dz2]

# Initial conditions
y0 = [np.pi / 2, 0, np.pi / 2 + 0.01, 0]

# Time span
t_max = 20
fps = 60
t_eval = np.linspace(0, t_max, t_max * fps)

# Solve ODE
sol = solve_ivp(double_pendulum_derivs, [0, t_max], y0, t_eval=t_eval, method='DOP853')

# Positions
x1 = L1 * np.sin(sol.y[0])
y1 = -L1 * np.cos(sol.y[0])

x2 = x1 + L2 * np.sin(sol.y[2])
y2 = y1 - L2 * np.cos(sol.y[2])

# Figure setup
fig, ax = plt.subplots(figsize=(6, 6))
ax.set_xlim(-2.2, 2.2)
ax.set_ylim(-2.2, 2.2)
ax.set_aspect('equal')
ax.axis('off')

# Lines
line1, = ax.plot([], [], lw=2, color='blue')
line2, = ax.plot([], [], lw=2, color='red')
trail1, = ax.plot([], [], lw=1, color='blue', alpha=0.6)
trail2, = ax.plot([], [], lw=1, color='red', alpha=0.6)

# Trails
trail1_x, trail1_y = [], []
trail2_x, trail2_y = [], []

# Drag state
dragging = False

# Initialization
def init():
    line1.set_data([], [])
    line2.set_data([], [])
    trail1.set_data([], [])
    trail2.set_data([], [])
    return line1, line2, trail1, trail2

# Animation function
def animate(i):
    line1.set_data([0, x1[i]], [0, y1[i]])
    line2.set_data([x1[i], x2[i]], [y1[i], y2[i]])

    trail1_x.append(x1[i])
    trail1_y.append(y1[i])
    trail2_x.append(x2[i])
    trail2_y.append(y2[i])

    trail1.set_data(trail1_x, trail1_y)
    trail2.set_data(trail2_x, trail2_y)

    return line1, line2, trail1, trail2

# Mouse interaction
def on_press(event):
    global dragging
    dragging = True

def on_release(event):
    global dragging, y0, sol, x1, y1, x2, y2
    dragging = False
    # Reset with new velocity based on drag
    dx = event.xdata
    dy = event.ydata
    if dx is None or dy is None:
        return
    angle1 = np.arctan2(dx, -dy)
    y0 = [angle1, 2.0, angle1 + 0.01, -1.5]  # Pushed angles and velocities
    sol = solve_ivp(double_pendulum_derivs, [0, t_max], y0, t_eval=t_eval, method='DOP853')
    x1[:] = L1 * np.sin(sol.y[0])
    y1[:] = -L1 * np.cos(sol.y[0])
    x2[:] = x1 + L2 * np.sin(sol.y[2])
    y2[:] = y1 - L2 * np.cos(sol.y[2])
    trail1_x.clear()
    trail1_y.clear()
    trail2_x.clear()
    trail2_y.clear()

fig.canvas.mpl_connect('button_press_event', on_press)
fig.canvas.mpl_connect('button_release_event', on_release)

# Run animation
ani = animation.FuncAnimation(fig, animate, frames=len(t_eval), interval=1000 / fps,
                              init_func=init, blit=True)

plt.show()