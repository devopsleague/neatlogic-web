export default ({result, view}) => {
  if (result) {
    view.call('setAllowDelete', true);
  } else {
    view.call('setAllowDelete', false);
  }
  view.addExecuteCount('allowDelete');
};
