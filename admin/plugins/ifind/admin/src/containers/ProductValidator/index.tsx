import React, { FunctionComponent, useCallback, useEffect, useState, useRef } from "react";
import { Header } from "@buffetjs/custom";

import FontAwesomeIcon from "../../components/FontAwesomeIcon";
import {
  BackgroundProcessProvider,
  useBackgroundProcess,
  I_BackgroundProcessProviderValues,
} from "../../providers/backgroundProcessProvider";

import LogsList from '../../components/LogsList';

import './styles.scss';

interface Props {};

export type statusLabelMapType = {
  [key: string]: any
};

const ProductValidator = () => {
  const { status = 'STOP', start, stop, logs, refetch }: I_BackgroundProcessProviderValues = useBackgroundProcess();
  const [ isStarting, setIsStarting ] = useState(false);
  const [ isStopping, setIsStopping ] = useState(false);
  const refetchTimeout = useRef<undefined|number>();

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

  const getButtonIcon = useCallback(() => {
    if ( isStarting || isStopping ) {
      return 'hour-glass';
    }

    switch ( status ) {
      case 'STOP':
      case 'ERROR' :
        return 'play';
      case 'START':
        return 'stop';
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
    switch ( status ) {
      case 'STOP':
      case 'ERROR' :
        setIsStarting(true);
        start && start();
        break;
      case 'START':
        setIsStopping(true);
        stop && stop();
        break;
    }
  }, [ status, isStarting, isStopping, start, stop ]);

  const refetchData = useCallback(() => {
    refetch && refetch();
  }, [ refetch ]);

  const checkRefetchTimeout = useCallback(() => {
    if ( status === 'START' ) {
      refetchTimeout.current = setTimeout(() => refetchData(), 1000);
    }
  }, [ status, refetchTimeout ]);

  useEffect(() => {
    setIsStarting(false);
    setIsStopping(false);
  }, [ status ]);

  useEffect(() => {
    checkRefetchTimeout();
  }, [ status, logs ]);

  return (
    <div className="container">
      <div className="row">
        <Header
          title={{ label: "Product Validator" }}
          actions={[
            {
              label: getButtonLabel(),
              onClick: onCTAClick,
              color: getButtonColor(),
              type: "button",
              disabled: isStopping || isStarting,
              icon: <FontAwesomeIcon icon={getButtonIcon()} />,
            },
          ]}
        />
        <div className="product-validator__header">
          {status && <div className="product-validator__status">Current status: <strong>{statusLabel}</strong></div>}
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
