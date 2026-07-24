import React, {useEffect, useState, type ReactNode} from 'react';
import {translate} from '@docusaurus/Translate';
import DropdownNavbarItem from '@theme/NavbarItem/DropdownNavbarItem';
import type {LinkLikeNavbarItemProps} from '@theme/NavbarItem';
import styles from './BrandSwitcher.module.css';

export type BrandId = 'default' | 'ruby' | 'emerald';

const STORAGE_KEY = 'acp-docs-brand';
const BRANDS: {id: BrandId; label: string}[] = [
  {id: 'default', label: 'Default'},
  {id: 'ruby', label: 'Ruby'},
  {id: 'emerald', label: 'Emerald'},
];

function isBrandId(value: string | null): value is BrandId {
  return value === 'default' || value === 'ruby' || value === 'emerald';
}

export function applyBrand(brand: BrandId): void {
  if (typeof document === 'undefined') {
    return;
  }
  document.documentElement.setAttribute('data-brand', brand);
  try {
    localStorage.setItem(STORAGE_KEY, brand);
  } catch {
    // Ignore private-mode / blocked storage.
  }
}

export function readStoredBrand(): BrandId {
  if (typeof window === 'undefined') {
    return 'default';
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isBrandId(stored) ? stored : 'default';
  } catch {
    return 'default';
  }
}

function IconPalette({
  className,
  width = 20,
  height = 20,
}: {
  className?: string;
  width?: number;
  height?: number;
}): ReactNode {
  return (
    <svg
      viewBox="0 0 24 24"
      width={width}
      height={height}
      aria-hidden
      className={className}>
      <path
        fill="currentColor"
        d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9c.83 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-.99 0-.83.67-1.5 1.5-1.5H16c2.76 0 5-2.24 5-5 0-4.42-4.03-8-9-8zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 9 6.5 9 8 9.67 8 10.5 7.33 12 6.5 12zm3-4C8.67 8 8 7.33 8 6.5S8.67 5 9.5 5s1.5.67 1.5 1.5S10.33 8 9.5 8zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 5 14.5 5s1.5.67 1.5 1.5S15.33 8 14.5 8zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 9 17.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"
      />
    </svg>
  );
}

type BrandSwitcherProps = {
  mobile?: boolean;
  position?: 'left' | 'right';
};

/**
 * Navbar brand pack switcher — same dropdown pattern as localeDropdown
 * (icon trigger + Infima menu). Uses `data-brand` so it does not clash with
 * Docusaurus light/dark `data-theme`.
 */
export default function BrandSwitcher({
  mobile,
  position = 'right',
  ...props
}: BrandSwitcherProps): ReactNode {
  const [brand, setBrand] = useState<BrandId>('default');

  useEffect(() => {
    const initial = readStoredBrand();
    setBrand(initial);
    applyBrand(initial);
  }, []);

  const selectBrand = (next: BrandId): void => {
    setBrand(next);
    applyBrand(next);
  };

  const items: LinkLikeNavbarItemProps[] = BRANDS.map((item) => ({
    label: item.label,
    href: '#',
    autoAddBaseUrl: false,
    className:
      item.id === brand
        ? mobile
          ? 'menu__link--active'
          : 'dropdown__link--active'
        : undefined,
    onClick: (event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
      selectBrand(item.id);
    },
  }));

  const currentLabel =
    BRANDS.find((item) => item.id === brand)?.label ?? 'Default';

  const dropdownLabel = mobile
    ? translate({
        message: 'Themes',
        id: 'theme.navbar.mobileBrandDropdown.label',
        description: 'The label for the mobile brand theme switcher dropdown',
      })
    : currentLabel;

  return (
    <DropdownNavbarItem
      {...props}
      mobile={mobile}
      position={position}
      label={
        <>
          <IconPalette className={styles.iconBrand} />
          {dropdownLabel}
        </>
      }
      items={items}
    />
  );
}
