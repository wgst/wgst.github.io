---
layout: page
title: research
permalink: /research/
---

### Bayesian Optimization and Property Models
I'm currently working on discovering new catalysts and optimizing reaction conditions using Bayesian optimization. This work focuses on training machine learning models to predict properties of ionic liquids and metal-organic frameworks (MOFs), which are crucial for identifying promising materials and reaction conditions for catalytic applications.


### Machine Learning Interatomic Potentials
In gas-surface dynamics applications, achieving both high accuracy in predicting reaction barriers and computational efficiency is critical, as running millions of trajectories is often required to obtain statistically meaningful results.

Another part of my research involves developing workflows and methods for training highly accurate and efficient machine learning interatomic potentials (MLIPs) at the lowest possible computational cost. 
This includes:
- Creating iterative refinement strategies for training MLIPs based on reaction probabilities for reactive hydrogen dynamics at metal surfaces ([JPCC 2023](https://pubs.acs.org/doi/10.1021/acs.jpcc.3c06648))
- Benchmarking different MLIP architectures (PaiNN, MACE, REANN, ACE) for gas-surface dynamics to identify optimal trade-offs between accuracy and computational efficiency ([MLST 2024](https://iopscience.iop.org/article/10.1088/2632-2153/ad5f11))
- Fine-tuning foundation models and using knowledge distillation to obtain accurate and efficient MLIPs ([npj Comp. Mat. 2025](https://doi.org/10.1038/s41524-025-01727-x))


### Nonadiabatic Effects in Gas-Surface Dynamics
During my PhD, I developed machine learning models to capture nonadiabatic effects in gas-surface dynamics, particularly for studying hydrogen molecule state-to-state scattering at metal surfaces.
([PRB 2025](https://journals.aps.org/prb/abstract/10.1103/h7vd-94pk)).


<img src="https://wgst.github.io/assets/sticking_cu111_non.png" width="340" class="image_sq"> 


### Selected publications
* **W. G. Stark**, C. L. Box, M. Sachs, N. Hertl, R. J. Maurer, Nonadiabatic reactive scattering of hydrogen on different surface facets of copper, Phys. Rev. B, 112, 3 (2025) [[arXiv]](http://arxiv.org/abs/2505.18147) [[journal]](https://link.aps.org/doi/10.1103/h7vd-94pk)

* M. Radova, **W. G. Stark**, C. S. Allen, R. J. Maurer, A. P. Bartók, Fine-tuning foundation models of materials interatomic potentials with frozen transfer learning, npj Comp. Mat. 11, 237 (2025) [[arXiv]](https://arxiv.org/abs/2502.15582) [[journal]](https://www.nature.com/articles/s41524-025-01727-x)

* M. Sachs, **W. G. Stark**, R. J. Maurer, and C. Ortner, Equivariant Representation of Configuration-Dependent Friction Tensors in Langevin Heatbaths, arXiv:2407.13935 (2024) [[arXiv]](https://arxiv.org/abs/2407.13935) [[journal]](https://iopscience.iop.org/article/10.1088/2632-2153/ada248)

* **W. G. Stark**, C. van der Oord, I. Batatia, Y. Zhang, B. Jiang, G. Csányi, and R. J. Maurer, Benchmarking of machine learning interatomic potentials for reactive hydrogen dynamics at metal surfaces, Mach. Learn.: Sci. Technol., 5, 3, 030501 (2024) [[arXiv]](https://arxiv.org/abs/2403.15334) [[journal]](http://doi.org/10.1088/2632-2153/ad5f11)

* **W. G. Stark**, J. Westermayr, O. A. Douglas-Gallardo, J. Gardner, S. Habershon, R. J. Maurer, Machine learning interatomic potentials for reactive hydrogen dynamics at metal surfaces based on iterative refinement of reaction probabilities, J. Phys. Chem. C, 127, 50, 24168–24182 (2023) [[arXiv]](https://arxiv.org/abs/2305.10873) [[journal]](https://pubs.acs.org/doi/10.1021/acs.jpcc.3c06648)


Find the full publication list on [google scholar](https://scholar.google.com/citations?user%253DKiNdem8AAAAJ)!


### Other contributions
* Adaptive sampling (active learning) for gas-surface dynamics - Tutorial: [ml-gas-surface](https://wgst.github.io/ml-gas-surface)

* Program for optimizing chemical processes, based on design of experiments - Do-Exp (MSc project):
[do-exp.com](http://do-exp.com)
