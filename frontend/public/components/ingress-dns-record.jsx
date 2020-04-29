import * as _ from 'lodash-es';
import * as React from 'react';

import { ColHead, DetailsPage, List, ListHeader, ListPage } from './factory';
import { Cog, navFactory, ResourceCog, SectionHeading, ResourceLink, ResourceSummary } from './utils';
import { fromNow } from './utils/datetime';
import { kindForReference } from '../module/k8s';
import { breadcrumbsForOwnerRefs } from './utils/breadcrumbs';
import { useTranslation } from 'react-i18next';
import { ResourcePlural } from './utils/lang/resource-plural';

const menuActions = [Cog.factory.ModifyLabels, Cog.factory.ModifyAnnotations, Cog.factory.Edit, Cog.factory.Delete];
const HDCModeFlag = window.SERVER_FLAGS.HDCModeFlag;

const IngressDNSRecordHeader = props => {
  const { t } = useTranslation();
  return (
    <ListHeader>
      <ColHead {...props} className="col-xs-6 col-sm-6" sortField="metadata.name">
        {t('CONTENT:NAME')}
      </ColHead>

      <ColHead {...props} className="col-sm-6 hidden-xs" sortField="metadata.creationTimestamp">
        {t('CONTENT:CREATED')}
      </ColHead>
    </ListHeader>
  );
};

const IngressDNSRecordRow = () =>
  // eslint-disable-next-line no-shadow
  function IngressDNSRecordRow({ obj }) {
    return (
      <div className="row co-resource-list__item">
        <div className="col-xs-6 col-sm-6 co-resource-link-wrapper">
          {!HDCModeFlag && <ResourceCog actions={menuActions} kind="IngressDNSRecord" resource={obj} />}
          <ResourceLink kind="IngressDNSRecord" name={obj.metadata.name} namespace={obj.metadata.namespace} title={obj.metadata.name} />
        </div>
        <div className="col-xs-6 col-sm-6 hidden-xs">{fromNow(obj.metadata.creationTimestamp)}</div>
      </div>
    );
  };

const DetailsForKind = kind =>
  function DetailsForKind_({ obj }) {
    const { t } = useTranslation();
    return (
      <React.Fragment>
        <div className="co-m-pane__body">
          <SectionHeading text={t('ADDITIONAL:OVERVIEWTITLE', { something: ResourcePlural('IngressDNSRecord', t) })} />
          <ResourceSummary resource={obj} podSelector="spec.podSelector" showNodeSelector={false} />
        </div>
      </React.Fragment>
    );
  };

export const IngressDNSRecordList = props => {
  const { kinds } = props;
  const Row = IngressDNSRecordRow(kinds[0]);
  Row.displayName = 'IngressDNSRecordRow';
  return <List {...props} Header={IngressDNSRecordHeader} Row={Row} />;
};
IngressDNSRecordList.displayName = IngressDNSRecordList;

export const IngressDNSRecordsPage = props => {
  const { t } = useTranslation();
  return HDCModeFlag ? <ListPage {...props} ListComponent={IngressDNSRecordList} canCreate={false} kind="IngressDNSRecord" /> : <ListPage {...props} ListComponent={IngressDNSRecordList} createButtonText={t('ADDITIONAL:CREATEBUTTON', { something: ResourcePlural(props.kind, t) })} canCreate={true} kind="IngressDNSRecord" />;
};
IngressDNSRecordsPage.displayName = 'IngressDNSRecordsPage';

export const IngressDNSRecordsDetailsPage = props => {
  const { t } = useTranslation();
  let menu = HDCModeFlag ? null : menuActions;
  let page = HDCModeFlag ? [navFactory.details(DetailsForKind(props.kind), t('CONTENT:OVERVIEW'))] : [navFactory.details(DetailsForKind(props.kind), t('CONTENT:OVERVIEW')), navFactory.editYaml()];
  return <DetailsPage {...props} kind="IngressDNSRecord" menuActions={menu} pages={page} />;
};

IngressDNSRecordsDetailsPage.displayName = 'IngressDNSRecordsDetailsPage';
