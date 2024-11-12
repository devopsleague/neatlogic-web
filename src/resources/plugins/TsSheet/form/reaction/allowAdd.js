export default ({result, view}) => {
  if (result) {
    view.call('setAllowAdd', true);
  } else {
    view.call('setAllowAdd', false);
  }
  view.addExecuteCount('allowAdd');
};
