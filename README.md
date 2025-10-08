Azure Static Web App;
Infrastructure bicep ;
Resources: Azure CosmosDB for MongoDB, Azure SWA with functions

# How to Deploy

1. Azure CLI installieren
2. Bicep CLI installieren
3. Bei Azure anmelden (az login)
4. Erstelle eine parameters.json Datei aus der Vorlage parameters.sample.json und trage Informationen ein (der MongoDB Verbindungsstring kann noch nicht eingetragen werden)
5. Ressourcen Gruppe erstellen:

   az group create \
   --name "XYZ" \
   --location westeurope

6. Deployment des CosmosDB Account (Warten bis deployed! Kann mehrere Minuten dauern):

   az deployment group create \
   --resource-group "XYZ" \
   --template-file infrastructure/cosmosdbAcc.bicep \
   --parameters @infrastructure/parameters.json

7. Mongo Connection-String aus Azure in parameters.json ergänzen (CosmosDB/Settings/Connection strings)
8. SWA-API-Token in Github Secrets speichern. (AZURE_STATIC_WEB_APPS_API_TOKEN in settings/secrets/actions aus SWA/overview manage deployment token)
9. Deployment der Database, Collection und SWA:

   az deployment group create \
   -- resource-group "XYZ" \
   -- template-file infrastructure/infra.bicep \
   -- parameters @infrastructure/parameters.json

   Infrastruktur ist nun erstellt.

Optional Datenbank mit Testdaten befüllen:
node testdata/seedMongodb.js

11. Code Commit veröffentlicht die Anwendung

In neuen Branches alten gitub actions workflow name, branch sowie api Token-Name ändern!
