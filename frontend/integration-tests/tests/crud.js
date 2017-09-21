const navigate = (browser, path, cb) => {
  const url = browser.launch_url + path;
  browser.url(url, ({error, value}) => {
    if (error) {
      console.error(value);
      process.exit(1);
    }
    console.log('navigated to ', url);
    cb();
  });
};

const TIMEOUT = 4000;

const crudTests_ = {};

[
  'daemonsets',
  'deployments',
  'replicasets',
  'replicationcontrollers',
  'jobs',
  'pods',
  'configmaps',
  'secrets',
  'etcdclusters',
  'prometheuses',
  'ingresses',
  'networkpolicies',
  // 'persistentvolumes', // TODO: (ggreer) needs a backing store (ebs, azure, nfs, etc)
  'persistentvolumeclaims',
  'resourcequotas',
  'services',
  // 'namespaces', // TODO: (kans) special case
  'serviceaccounts',
  'statefulsets',
  'roles',
].forEach(resource => {
  crudTests_[`YAML - ${resource}`] = browser => {
    const crudPage = browser.page.crudPage();

    console.log('Testing', resource);
    navigate(browser, `/all-namespaces/${resource}`, () => {
      crudPage
        .waitForElementVisible('@CreateYAMLButton', TIMEOUT)
        .click('@CreateYAMLButton')
        .waitForElementVisible('@saveYAMLButton', TIMEOUT)
        .click('@saveYAMLButton');

      browser.pause(TIMEOUT);

      crudPage.isVisible('@actionsDropdownButton', (visible) => {
        if (visible.status === 0) {
          console.log('Resource created');
          //with verify(), when an assertion fails, the test logs the failure and continues with other assertions.
          browser.verify.urlContains('/example/details');
          crudPage
            .click('@actionsDropdownButton')
            .click('@actionsDropdownDeleteLink')
            .waitForElementVisible('@deleteModalConfirmButton', TIMEOUT)
            .click('@deleteModalConfirmButton')
            .waitForElementVisible('@CreateYAMLButton', TIMEOUT);
        } else {
          console.log('Resource creation failed');
        }
      });
    });
  };
});

crudTests_.after = browser => browser.end();

module.exports = crudTests_;