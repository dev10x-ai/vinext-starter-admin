import React, {useEffect} from 'react';
import {applyBrand, readStoredBrand} from '@site/src/components/BrandSwitcher';

type RootProps = {
  children: React.ReactNode;
};

/**
 * Applies persisted admin brand pack before paint of interactive chrome.
 * Light/dark remains owned by Docusaurus color mode.
 */
export default function Root({children}: RootProps): React.ReactElement {
  useEffect(() => {
    applyBrand(readStoredBrand());
  }, []);

  return <>{children}</>;
}
