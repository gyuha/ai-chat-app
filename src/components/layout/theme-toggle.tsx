import { MonitorIcon, MoonStarIcon, SunIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  selectThemePreference,
  type ThemePreference,
  useUiStore,
} from '@/stores/ui-store';

const themeMeta: Record<
  ThemePreference,
  {
    description: string;
    icon: typeof MoonStarIcon;
    label: string;
  }
> = {
  dark: {
    description: '다크 모드가 기본으로 적용됩니다.',
    icon: MoonStarIcon,
    label: '다크',
  },
  light: {
    description: '밝은 테마로 전환합니다.',
    icon: SunIcon,
    label: '라이트',
  },
  system: {
    description: '시스템 설정을 따릅니다.',
    icon: MonitorIcon,
    label: '시스템',
  },
};

export function ThemeToggle() {
  const themePreference = useUiStore(selectThemePreference);
  const setThemePreference = useUiStore((state) => state.setThemePreference);
  const currentTheme = themeMeta[themePreference];
  const CurrentIcon = currentTheme.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          aria-label="테마 전환"
          className="size-9 rounded-xl border-[var(--color-border)] bg-[var(--color-panel)] text-[var(--color-text)] hover:bg-[color-mix(in_srgb,var(--color-panel)_82%,white)]"
          size="icon"
          variant="outline"
        >
          <CurrentIcon className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 rounded-2xl border border-[var(--color-border)] bg-[var(--color-panel)] p-2 text-[var(--color-text)]"
      >
        <DropdownMenuLabel>테마</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={themePreference}
          onValueChange={(value) =>
            setThemePreference(value as ThemePreference)
          }
        >
          {(
            Object.entries(themeMeta) as Array<
              [ThemePreference, (typeof themeMeta)[ThemePreference]]
            >
          ).map(([value, theme]) => {
            const ThemeIcon = theme.icon;

            return (
              <DropdownMenuRadioItem
                key={value}
                className="rounded-xl px-3 py-2"
                value={value}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-[var(--color-text-muted)]">
                    <ThemeIcon className="size-4" />
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-[var(--color-text)]">
                      {theme.label}
                    </span>
                    <span className="text-xs leading-5 text-[var(--color-text-muted)]">
                      {theme.description}
                    </span>
                  </div>
                </div>
              </DropdownMenuRadioItem>
            );
          })}
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="rounded-xl px-3 py-2 text-xs text-[var(--color-text-muted)]">
          현재 설정: {currentTheme.label}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
