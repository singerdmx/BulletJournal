# Develop Environment setup for Windows using WSL2


# Setup WSL2

## check your windows version

press `windows + r` and type in `winver` 
if you see **Windows 10, Version 2004, Build 19041** or higher, your windows should have WSL2 already available

Otherwise check You may need to [update your Windows version](ms-settings:windowsupdate).
or check the following link for [how to update to windows 10 version 2004](https://community.windows.com/en-us/videos/how-to-get-the-windows-10-may-2020-update/YtqNzdrtrmw)

## Install Linux distribution on Microsoft store 
Before installing any Linux distributions on Windows, you must enable the "Windows Subsystem for Linux" optional feature.
Open PowerShell as Administrator and run:

    dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart

####  Install your Linux distribution of choice

open Microsoft store, search for any Linux distro and [install](https://docs.microsoft.com/en-us/windows/wsl/install-win10#install-your-linux-distribution-of-choice) 

for example, install **Ubuntu 18.04 LTS** 

#### Update to WSL 2

Get install Linux distro on the computer

Open PowerShell as Administrator and run

    wsl -l
 Change distro to use WSL2

     wsl --set-version Ubuntu-18.04 2
You may need to manually update wsl kernel
 [https://docs.microsoft.com/en-us/windows/wsl/wsl2-kernel](https://docs.microsoft.com/en-us/windows/wsl/wsl2-kernel)

verify the update 

    wsl -l -v
####  Troubleshooting installation WSL2
check the following page for any troubleshooting 
[https://docs.microsoft.com/en-us/windows/wsl/install-win10#troubleshooting-installation](https://docs.microsoft.com/en-us/windows/wsl/install-win10#troubleshooting-installation)

# install docker with WSL2

follow the instruction in the link 
[https://docs.docker.com/docker-for-windows/wsl/](https://docs.docker.com/docker-for-windows/wsl/)

# setup the develop environment for the project

## install git
run following command in your Linux distro

    sudo apt update
    sudo apt install git
    
## get the project from git
run following command in your Linux distro

    git clone https://github.com/singerdmx/BulletJournal.git
## build image 
run following command in your Linux distro
    
    cd BulletJournal
    chmod +x buildImage.sh
## start the docker
open the docker desktop from windows
wait until the docker application show **docker desktop is running** 
run following command in your Linux distro

    ./start.sh


# Miscellaneous
## set up a desktop environment for ubuntu 
[https://www.tenforums.com/tutorials/144208-windows-subsystem-linux-add-desktop-experience-ubuntu.html](https://www.tenforums.com/tutorials/144208-windows-subsystem-linux-add-desktop-experience-ubuntu.html)

## Limit WSL2 memory and CPU resource usage
Go to c:\users\{your user name}
Create **.wslconfig** file  

    [wsl2]
    memory=4GB # Limits VM memory in WSL 2 to 4 GB
    processors=5 # Makes the WSL 2 VM use two virtual processors
check the following link for more detail for WSL2 config
[https://docs.microsoft.com/en-us/windows/wsl/wsl-config#configure-global-options-with-wslconfig](https://docs.microsoft.com/en-us/windows/wsl/wsl-config#configure-global-options-with-wslconfig)

## restart WSL2
At an administrative PowerShell prompt

    Restart-Service LxssManager
    
##  Access Linux Files from Windows 10
Open the WSL distro (ex: "Ubuntu") you want, and make sure your current folder is your Linux home directory.

Copy and paste `explorer.exe .` in the WSL distro console window, and press **Enter**.