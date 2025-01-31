from setuptools import setup, find_packages

setup(
    name='visual_scripting',
    version='0.0.2',
    description=' ',
    author='Eleanora DCosta',
    author_email='eleanora17d@gmail.com',
    packages=find_packages(exclude=['tests','.venv']),
    install_requires=['selenium', 'requests', 'behave'],
)
