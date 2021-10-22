console.log('Child Process Log', new Date());

setTimeout(() => {
  process.exit();
}, 10000);
