function crasher(a) {
  delete a.bla;
}

const a = {
  bla: 'bla',
};

// source

{
  let a = {};
  crasher(a);
}

// end
