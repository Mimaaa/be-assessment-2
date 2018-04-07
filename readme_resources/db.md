1. **Install apps**

- [PostgreSQL.app](https://postgresapp.com/)
- [TablePlus](https://tableplus.io/)

2. **Setup PostgreSQL.app**

After installing the PostgreSQL.app you will see an elephant icon in your task bar. 

- Click on the icon and click on `open postgres`
- Click on `initialize` and the status of your DB will be on `runnin`

3. **Import data**

- Open TablePlus and click on `create new connection` in the right corner
- Click on `PostgreSQL` and click on `create`

```
name = localhost
host = localhost
```

- Click on `connect`
- Click on `file` then on `close`
- Click on `restore`
- Choose the dump file
- Choose the connection
- Click on `new database`
- Call it `pwrlifting`
- Click on `restore`
- Click on `dismiss`
- Close the window
- Double click on the connection (database)

4. **Select database**

Use the `CMD + K` shortcut and double click on `pwrlifting`. If everything went according plan you are able to see the tables on the left side. If you click on a table you can view the data.

5. **Add environment variables**

Copy and paste this in your .env file.

```
PGHOST='localhost'
PGDATABASE='pwrlifting'
PGPASSWORD=null
PGPORT=5432
```

6. **Success!**

You can go back to the [installation readme](https://github.com/Mimaaa/be-assessment-2#installation).







