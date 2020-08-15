mkdir d:\docker\volumes\postgres
mkdir d:\docker\volumes\db_backup
mkdir d:\docker\volumes\log
mkdir d:\docker\log

IF [%1]==[] goto regular

IF %1%==dev goto dev

IF %1%==elk goto elk

:regular
docker-compose -f ./docker-compose-win.yml up -d
goto done

:elk
docker-compose -f ./docker-compose-win.yml -f ./elk/docker-compose-win.yml up -d
goto done

:done
echo Done