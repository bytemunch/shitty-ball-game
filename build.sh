#!/bin/bash

echo "Cleaning public folder..."
rm -rf ./public/*

echo "Cleaning levels folder..."
rm -rf ./src/root/levels/**/*

echo "Compiling TS..."
tsc

echo "Copy level PNGs..."
rsync -a ./aseprite/levels/easy/*.png ./src/root/levels/easy/
echo "Rename easy levels..."

COUNTER=0
cd ./src/root/levels/easy/
for FILENAME in *.png
do 
    let COUNTER++
    mv $FILENAME "$COUNTER.png"
done

cd ../../../../

rsync -a ./aseprite/levels/medium/*.png ./src/root/levels/medium/

echo "Rename medium levels..."

COUNTER=0
cd ./src/root/levels/medium/
for FILENAME in *.png
do 
    let COUNTER++
    mv $FILENAME "$COUNTER.png"
done

cd ../../../../

rsync -a ./aseprite/levels/hard/*.png ./src/root/levels/hard/

echo "Rename hard levels..."

COUNTER=0
cd ./src/root/levels/hard/
for FILENAME in *.png
do 
    let COUNTER++
    mv $FILENAME "$COUNTER.png"
done

cd ../../../../

rsync -a ./aseprite/levels/bonus/*.png ./src/root/levels/bonus/

echo "Rename bonus levels..."

COUNTER=0
cd ./src/root/levels/bonus/
for FILENAME in *.png
do 
    let COUNTER++
    mv $FILENAME "$COUNTER.png"
done

cd ../../../../

echo "Adding root files..."
rsync -a ./src/root/* ./public/