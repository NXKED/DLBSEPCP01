@description('Name des CosmosDB Accounts')
param cosmosDbAccountName string

@description('Region')
param location string = resourceGroup().location


// Cosmos DB ACC
resource cosmosDb 'Microsoft.DocumentDB/databaseAccounts@2025-05-01-preview' = {
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
    capacityMode: 'Serverless'
    enableFreeTier: true
    capabilities: [
      {
        name: 'EnableMongo'
      }
    ]
  }
}
