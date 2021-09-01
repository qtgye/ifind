import React, { FunctionComponent, useCallback, useState } from "react";
import { Header } from "@buffetjs/custom";

import FontAwesomeIcon from "../../components/FontAwesomeIcon";
import {
  BackgroundProcessProvider,
  useBackgroundProcess,
} from "../../providers/backgroundProcessProvider";

import LogsList, { LogsListProps, LOG_TYPE } from '../../components/LogsList';

interface Props {};

export type statusLabelMapType = {
  [key: string]: any
};

const ProductValidator = () => {
  const { status = 'STOP', start, stop, logs }: LogsListProps = useBackgroundProcess();
  const [ isStarting, setIsStarting ] = useState(false);
  const [ isStopping, setIsStopping ] = useState(false);

  const statusLabelMap: statusLabelMapType = {
    STOP: 'Stopped',
    START: 'Running',
    ERROR: 'Stopped with Error',
  };

  const statusLabel: string = typeof status === 'string' ? statusLabelMap[status] : 'STOP';

  const getButtonLabel = useCallback(() => {
    switch ( status ) {
      case 'STOP':
      case 'ERROR' :
        return isStarting ? 'Starting...' : 'Start';
      case 'START':
        return isStopping ? 'Stopping...' : 'Stop';
    }
  }, [ status, isStarting, isStopping ]);

  const getButtonColor = useCallback(() => {
    switch ( status ) {
      case 'STOP':
      case 'ERROR' :
        return 'success';
      case 'START':
        return 'delete';
    }
  }, [ status ]);

  const onCTAClick = useCallback(() => {
    // switch ( status ) {
    //   case 'STOP':
    //   case 'ERROR' :
    //     setIsStarting(true);
    //     start();
    //   case 'START':
    //     setIsStopping(true);
    //     stop();
    // }
  }, [ status, isStarting, isStopping, start, stop ]);

  return (
    <div className="container">
      <div className="row">
        <Header
          title={{ label: "Product Validator" }}
          actions={[
            {
              label: getButtonLabel(),
              onClick: onCTAClick(),
              color: getButtonColor(),
              type: "button",
              disabled: isStopping || isStarting,
              icon: <FontAwesomeIcon icon="flag-checkered" />,
            },
          ]}
        />
        <div className="product-validator__header">
          {status && <h2 className="product-validator__status">{statusLabel}</h2>}
        </div>
        <div className="product-validator__logs">
          { logs?.length && (
            <LogsList status={status} logs={logs} />
          ) }
        </div>
      </div>
    </div>
  );
};

export default (props: Props) => (
  <BackgroundProcessProvider>
    <ProductValidator {...props} />
  </BackgroundProcessProvider>
);
