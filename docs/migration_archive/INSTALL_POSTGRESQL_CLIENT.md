# 📦 Installation PostgreSQL Client

Pour utiliser la méthode SQL (la plus rapide), vous devez installer PostgreSQL client.

## Ubuntu/Debian

```bash
sudo apt-get update
sudo apt-get install postgresql-client
```

## Vérification

```bash
pg_dump --version
psql --version
```

Vous devriez voir quelque chose comme :
```
pg_dump (PostgreSQL) 14.x
psql (PostgreSQL) 14.x
```

## Après l'installation

Vous pouvez maintenant utiliser la **Méthode 1** du guide `GUIDE_MIGRATION_CLOUD_TO_LOCAL.md` qui est la plus rapide et la plus fiable.

---

**Note** : Si vous ne pouvez pas installer PostgreSQL client, utilisez la **Méthode 2** (script de migration via API) qui ne nécessite aucune installation supplémentaire.
