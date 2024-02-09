#/bin/bash

cd ../
sudo rm hfs-fullstack.zip
sudo zip -r hfs-fullstack.zip hfs-fullstack/
zip --test --verbose hfs-fullstack.zip
