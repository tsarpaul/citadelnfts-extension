path = 'node_modules/@metamask/inpage-provider/dist/MetaMaskInpageProvider.js'
with open(path, 'r') as f:
  content = f.read()
content = content.replace('if (shouldSendMetadata)', 'if (false)')
with open(path, 'w') as f:
  f.write(content)
  

