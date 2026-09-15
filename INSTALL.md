# Server Setup — Software Requirements

What needs to be installed on a machine (dev laptop or a real server) to run this
project. Two paths: **Docker** (recommended — matches `docker-compose.yml`, least
drift between machines) or **Manual** (install each piece natively — useful if
Docker isn't available on the target server).

## Path A — Docker (recommended)

| Software | Version | Purpose |
|---|---|---|
| Git | any recent | clone the repo |
| Docker Engine | 24+ | runs Postgres+pgvector, backend, frontend containers |
| Docker Compose plugin | v2 (`docker compose`, not the old `docker-compose`) | runs `docker-compose.yml` |

### Install (Ubuntu/Debian server)

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg git

# Docker's official install script (covers Engine + Compose plugin)
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER   # log out/in after this

docker --version
docker compose version
```

Then, from the repo root:

```bash
cp .env.example .env      # fill in model API keys (see .env.example)
docker compose up -d
```

This is the only path required to run everything (`db`, `backend`, `frontend`) —
nothing else needs to be installed on the host.

## Path B — Manual (no Docker)

Needed only if the server can't run Docker. Installs each component natively.

| Software | Version | Purpose |
|---|---|---|
| Git | any recent | clone the repo |
| Python | 3.11+ | backend (`src/backend`), agents (`src/agents`) |
| pip / venv | bundled with Python | Python dependency management |
| Node.js | 20 LTS | frontend (`src/frontend/next-app`) |
| npm | bundled with Node | frontend dependency management |
| PostgreSQL | 16 | primary database |
| pgvector extension | 0.7+ | vector similarity search for `src/context` (RAG) |

### Install (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install -y git build-essential

# Python 3.11
sudo apt-get install -y python3.11 python3.11-venv python3-pip

# Node.js 20 LTS (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PostgreSQL 16
sudo apt-get install -y postgresql-16 postgresql-server-dev-16

# pgvector extension (build from source against the installed PG version)
git clone --branch v0.7.4 https://github.com/pgvector/pgvector.git
cd pgvector && make && sudo make install
```

Then, inside `psql` on the target database:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

### Python/Node dependencies

Once `src/backend/requirements.txt` and `src/frontend/next-app/package.json`
exist (added as each app is scaffolded — see `.claude/specs/.../tasks.md`,
Day 1), install with:

```bash
# backend
python3.11 -m venv .venv && source .venv/bin/activate
pip install -r src/backend/requirements.txt

# frontend
cd src/frontend/next-app && npm install
```

## Either path — required accounts/keys

Not installed software, but required before anything runs — see `.env.example`:

- At least one of: OpenAI, Groq, or Gemini API key (model providers used by
  `src/agents/*`, per `.claude/steering/ai-guidelines.md`).
- Nothing else external is required for the hackathon build (no real core-banking
  or KYC vendor integration — see `.claude/steering/product.md`, non-goals).

## Verify the install

- `docker compose ps` (Path A) shows `db`, `backend`, `frontend` all `Up`, **or**
  `psql`, `python3.11 --version`, `node --version` all resolve (Path B).
- `curl localhost:8000/docs` returns the FastAPI OpenAPI page once the backend is
  scaffolded and running.
- `curl localhost:3000` returns the frontend once it's scaffolded and running.
