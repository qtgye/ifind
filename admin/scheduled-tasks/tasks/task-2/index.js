(async () => {
  let i = 0;

  while ( i < 30 ) {
    console.log('Log from task 2');
    await new Promise(resolve => setTimeout(resolve, 1000));
    i++;
  }

  process.exit();
})();
