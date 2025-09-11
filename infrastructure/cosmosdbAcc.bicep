@description('Name der Static Web App')
param staticWebAppName string

@description('Name des CosmosDB Accounts')
param cosmosDbAccountName string

@description('Region')
param location string = resourceGroup().location

@description('Github Repo URL')
param repoUrl string

@description('Branch')
param branch string

@description('Verbindungsstring fuer CosmosDB')
param mongoUrl string

// Cosmos DB ACC
resource cosmosDb 'Microsoft.DocumentDB/databaseAccounts@2024-05-15' = {
  name: cosmosDbAccountName
  location: location
  kind: 'MongoDB'
  tags: {
    'hidden-workload-type': 'Learning'
  }
  properties: {
    databaseAccountOfferType: 'Standard'
    enableMultipleWriteLocations: false //bcof availability zone issue
    enableAutomaticFailover: false // ^^
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false // ^^
      }
    ]
    apiProperties: {
      serverVersion: '7.0'
    }
    enableFreeTier: false
    capabilities: [
      {
        name: 'EnableMongo'
      }
      {name: 'EnableServerless'}
    ]
  }
}
