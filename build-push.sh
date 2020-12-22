#!/bin/sh
# Copy this file out of project, then run build and push docker image
DOCKERHUB_NAME=""
VERSION="1.1.$(date +%Y%m%d%H%M)"
HOME=""
ROOTBULLETJOURNAL=""
LOGFILE=""
DOCKER_USERNAME=""
DOCKER_PASSWORD=""
GIT_PUBLIC_REPO="https://github.com/singerdmx/BulletJournal.git"
GIT_REPO=""

echo $DOCKERHUB_NAME
echo $VERSION

sync_git_repo() {
    
    echo "sync git repo"

    cd $HOME

    rm -rf $ROOTBULLETJOURNAL

    git clone $GIT_PUBLIC_REPO
    
}

genereate_frontend_version() {
    echo "generate frontend version"

    cd $ROOTBULLETJOURNAL/frontend/src/apis/
    
    sed "s/BULLETJOURNAL_VERSION/$VERSION/g" versions-TEMPLATE > versions.ts
}

generate_docker_compose_yml() {
    echo "generate_docker_compose_yml"

    cd $ROOTBULLETJOURNAL/deployment

    echo "# IMPORTANT: This file is auto-generated in build time; any change should be in docker-compose-TEMPLATE.yml" > docker-compose.yml

    sed "s/BULLETJOURNAL_VERSION/$VERSION/g" docker-compose-TEMPLATE.yml >> docker-compose.yml

}

git_push() {
    echo "####### git push ###########"
    
    cd $ROOTBULLETJOURNAL/deployment

    git add docker-compose.yml
    
    git add $ROOTBULLETJOURNAL/frontend/src/apis/versions.ts

    git commit -m "release $VERSION"

    git remote set-url origin $GIT_REPO

    git push
}
 
build_images() {
    echo "####### build image ###########"
    # frontend
    cd $ROOTBULLETJOURNAL/frontend
    /usr/local/bin/docker build -t $DOCKERHUB_NAME/bulletjournal-frontend:$VERSION .
    
    # backend
    cd $ROOTBULLETJOURNAL/backend
    cp -R $ROOTBULLETJOURNAL/protobuf $ROOTBULLETJOURNAL/backend/
    DOCKER_BUILDKIT=1 /usr/local/bin/docker build -t $DOCKERHUB_NAME/bulletjournal-backend:$VERSION .
    
    # daemon
    cd $ROOTBULLETJOURNAL/daemon
    rm -rf ./proto_gen
    mkdir -p ./proto_gen/github.com/singerdmx/BulletJournal
    cp -R ../protobuf ./proto_gen/github.com/singerdmx/BulletJournal/
    /usr/local/bin/docker build -t $DOCKERHUB_NAME/bulletjournal-daemon:$VERSION .
}

push_images() {
    echo "######## push image #############"
    whoami
    pwd
    /usr/local/bin/docker login -u="$DOCKER_USERNAME" -p="$DOCKER_PASSWORD"
    /usr/local/bin/docker -v
    /usr/local/bin/docker push $DOCKERHUB_NAME/bulletjournal-frontend:$VERSION
    /usr/local/bin/docker push $DOCKERHUB_NAME/bulletjournal-backend:$VERSION
    /usr/local/bin/docker push $DOCKERHUB_NAME/bulletjournal-daemon:$VERSION
    echo "!!!!!!!! push image !!!!!!!!!!!!!"
}

echo "########## new ######"$VERSION
sync_git_repo
genereate_frontend_version
generate_docker_compose_yml
git_push
build_images
push_images
echo "########## end ######"$VERSION