https://hub.docker.com/r/gitlab/gitlab-ce/

https://hub.docker.com/r/gitlab/gitlab-ce/tags/

https://docs.gitlab.com/ee/install/docker.html#install-gitlab-using-docker-compose

https://docs.gitlab.com/runner/install/docker.html

docker pull gitlab/gitlab-ce:16.8.1-ce.0
sudo mkdir -p /srv/gitlab
export GITLAB_HOME=/srv/gitlab

# GITLAB
http://localhost:8929

username = root
password = 5iveL!fe

mkdir teste
cd teste
git clone http://localhost:8929/disad/hfsfullstack.git


# Como adicionar no git

git config --global user.name "riquefsouza"
git config --global user.email riquefsouza@gmail.com

git config --list

gh repo clone riquefsouza/hfs-fullstack
gh auth login
 
cd ~/mygithub/hfs-fullstack
git add .
git commit -m "first time"
git commit -m "first time"
git push -u origin main

