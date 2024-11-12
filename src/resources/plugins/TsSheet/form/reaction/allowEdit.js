export default ({result, view}) => {
  if (result) {
    view.call('setAllowEdit', true);
  } else {
    view.call('setAllowEdit', false);
  }
  view.addExecuteCount('allowEdit');
};
