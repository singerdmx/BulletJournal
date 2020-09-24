<a href="https://bulletjournal.us/home/index.html"><img src=
"https://user-images.githubusercontent.com/122956/72955931-ccc07900-3d52-11ea-89b1-d468a6e2aa2b.png"
 width="150px" height="150px"></a>

<b>BulletJournal</b> is an open source platform for notebook keeping, ledger management, task/project management and coordination with speciality in personal organization, scheduling, reminders, to-do lists, notes sharing, multi-person ledger and team project collaboration.

## Installation
- Docker

### Pre-requisite (Docker)
- Docker 19.03.5+
- Postgres 9.4+
- Docker Compose 1.25+ (optional but recommended)

## Quick Start
Please open the terminal and execute the command below. Make sure you have installed docker-compose in advance.
```bash
git clone https://github.com/singerdmx/BulletJournal.git
cd BulletJournal
chmod +x buildImage.sh
chmod +x start.sh
```

Next, you can look into the `docker-compose.yml` for detailed config parameters. Then execute the command below to start the services.

```bash
./buildImage.sh
./start.sh
```

Open the browser and enter `https://localhost` to see the UI interface.
Open the browser and enter `http://localhost:8080/swagger-ui.html` to see the API documentation.
