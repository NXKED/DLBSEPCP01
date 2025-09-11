Azure Static Web App;
Infrastructure bicep ;
Resources: Azure CosmosDB for MongoDB, Azure SWA with functions

# How to Deploy

1. Azure CLI installieren
2. Bicep CLI installieren
3. Bei Azure anmelden
4. Erstelle eine parameters.json Datei aus der Vorlage parameters.sample.json und trage Informationen ein (der MongoDB Verbindungsstring kann noch nicht eingetragen werden)
5. Ressourcen Gruppe erstellen

   az group create \
   --name "XYZ" \
   --location westeurope

6. Deployment des CosmosDB Account (Warten bis deployed! Kann mehrere Minuten dauern)

   az deployment group create \
   --resource-group "XYZ" \
   --template-file infrastructure/cosmosdbAcc.bicep \
   --parameters @infrastructure/parameters.json

7. Connection-String aus Azure in parameters.json ergänzen
8. Deployment Database, Collection und SWA

   az deployment group create \
   -- resource-group "XYZ" \
   -- template-file infrastructure/infra.bicep \
   -- parameters @infrastructure/parameters.json

   Infrastruktur ist nun erstellt.
9. Code Commit veröffentlicht die Anwendung


In neuen Branches alten gitub actions workflow name, branch sowie api Token-Name ändern!
