@echo off
echo Building ProfessionalAIze Chrome Extension...

call npm run build

echo Copying extension files...
copy public\manifest.json dist\
copy public\background.js dist\
copy public\options.html dist\
copy public\options.js dist\

echo Extension built successfully!
echo Load the 'dist' folder as an unpacked extension in Chrome Developer mode.

pause