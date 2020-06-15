IF [%1]==[] goto regular

IF %1%==dev goto dev

IF %1%==elk goto elk

:regular
docker-compose -f ./docker-compose-win.yml down
goto done

:dev
docker-compose -f ./docker-compose-win-dev.yml -f ./elk/docker-compose-win.yml down
goto done

:elk
docker-compose -f ./docker-compose-win.yml -f ./elk/docker-compose-win.yml down
goto done

:done
echo Done