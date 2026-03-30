import {
  CircleAlertIcon,
  CircleCheckIcon,
  KeyRoundIcon,
  Loader2Icon,
  PaletteIcon,
  SlidersHorizontalIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useApiKeyValidation } from '@/hooks/use-api-key-validation';
import { useFreeModelsQuery } from '@/hooks/use-free-models-query';
import {
  useSettingsActions,
  useSettingsQuery,
} from '@/hooks/use-settings-query';
import {
  selectThemePreference,
  type ThemePreference,
  useUiStore,
} from '@/stores/ui-store';

const INVALID_API_KEY_MESSAGE =
  '입력한 키로 모델 목록을 불러오지 못했습니다. 키를 확인한 뒤 다시 시도해 주세요.';
const TRANSIENT_API_KEY_MESSAGE =
  '일시적인 문제로 모델 목록을 확인하지 못했습니다. 잠시 후 다시 시도해 주세요.';

const themeOptions: Array<{
  description: string;
  label: string;
  value: ThemePreference;
}> = [
  {
    description: '기본 권장값',
    label: '다크',
    value: 'dark',
  },
  {
    description: '밝은 테마',
    label: '라이트',
    value: 'light',
  },
  {
    description: '시스템 따름',
    label: '시스템',
    value: 'system',
  },
];

type StatusTone = 'default' | 'error' | 'success';

type StatusState = {
  message: string;
  tone: StatusTone;
};

export function SettingsPanelPlaceholder() {
  const themePreference = useUiStore(selectThemePreference);
  const setThemePreference = useUiStore((state) => state.setThemePreference);
  const settingsQuery = useSettingsQuery();
  const settingsActions = useSettingsActions();
  const validationMutation = useApiKeyValidation();
  const settings = settingsQuery.data;
  const freeModelsQuery = useFreeModelsQuery(settings?.openRouterApiKey);
  const freeModels = freeModelsQuery.data ?? [];
  const [draftApiKey, setDraftApiKey] = useState('');
  const [defaultSystemPrompt, setDefaultSystemPromptValue] = useState('');
  const [statusState, setStatusState] = useState<StatusState | null>(null);

  useEffect(() => {
    setDefaultSystemPromptValue(settings?.defaultSystemPrompt ?? '');
  }, [settings?.defaultSystemPrompt]);

  const hasSavedApiKey = Boolean(settings?.openRouterApiKey);
  const selectedModelName =
    freeModels.find((model) => model.id === settings?.defaultModelId)?.name ??
    null;
  const resolvedStatus: StatusState =
    statusState ??
    (hasSavedApiKey
      ? {
          message: '현재 저장된 API 키가 있습니다.',
          tone: 'success',
        }
      : {
          message:
            '저장된 API 키가 없습니다. 모델 목록 확인 후 저장할 수 있습니다.',
          tone: 'default',
        });

  async function handleApiKeySubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextApiKey = draftApiKey.trim();

    if (!nextApiKey) {
      setStatusState({
        message: 'OpenRouter API 키를 입력한 뒤 다시 시도해 주세요.',
        tone: 'error',
      });
      return;
    }

    const result = await validationMutation.mutateAsync(nextApiKey);

    if (result.kind === 'success') {
      if (hasSavedApiKey) {
        await settingsActions.replaceApiKeyAfterValidation(nextApiKey);
      } else {
        await settingsActions.saveApiKeyAfterValidation(nextApiKey);
      }

      setDraftApiKey('');
      setStatusState({
        message: '모델 목록을 확인했고 API 키를 저장했습니다.',
        tone: 'success',
      });
      toast.success('API 키를 저장했습니다.');
      return;
    }

    if (result.kind === 'invalid_credentials') {
      setStatusState({
        message: INVALID_API_KEY_MESSAGE,
        tone: 'error',
      });
      toast.error('입력한 키를 다시 확인해 주세요.');
      return;
    }

    setStatusState({
      message: TRANSIENT_API_KEY_MESSAGE,
      tone: 'error',
    });
    toast.error('일시적인 문제로 모델 목록을 확인하지 못했습니다.');
  }

  async function handleDeleteApiKey() {
    await settingsActions.deleteApiKey();
    setDraftApiKey('');
    setStatusState({
      message: 'API 키를 삭제했습니다.',
      tone: 'success',
    });
    toast.success('API 키를 삭제했습니다.');
  }

  async function handleDefaultModelChange(modelId: string) {
    await settingsActions.setDefaultModelId(modelId);
  }

  function handleSystemPromptChange(
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) {
    const defaultSystemPrompt = event.target.value;

    setDefaultSystemPromptValue(defaultSystemPrompt);
    void settingsActions.setDefaultSystemPrompt(defaultSystemPrompt);
  }

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
        <Panel
          description="브라우저에 저장된 키로 모델 목록을 불러와 검증합니다."
          title="API 키 관리"
        >
          <form className="grid gap-3" onSubmit={handleApiKeySubmit}>
            <label
              className="text-sm font-medium text-[var(--color-text)]"
              htmlFor="settings-openrouter-api-key"
            >
              OpenRouter API Key
            </label>
            <Input
              className="h-12 rounded-2xl border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-panel)_86%,black)] px-4 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
              id="settings-openrouter-api-key"
              onChange={(event) => setDraftApiKey(event.target.value)}
              placeholder="sk-or-v1-..."
              type="password"
              value={draftApiKey}
            />
            <StatusMessage
              message={resolvedStatus.message}
              tone={resolvedStatus.tone}
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                className="h-11 rounded-2xl px-5 text-sm font-medium"
                disabled={
                  draftApiKey.trim().length === 0 ||
                  validationMutation.isPending
                }
                type="submit"
              >
                {validationMutation.isPending ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />키 확인 중
                  </>
                ) : (
                  <>
                    <KeyRoundIcon className="size-4" />키 확인하기
                  </>
                )}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    className="h-11 rounded-2xl border-[var(--color-border)] bg-transparent px-5 text-sm text-[var(--color-text)] hover:bg-[color-mix(in_srgb,var(--color-panel)_82%,white)]"
                    disabled={!hasSavedApiKey}
                    type="button"
                    variant="outline"
                  >
                    삭제
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>API 키 삭제</AlertDialogTitle>
                    <AlertDialogDescription>
                      저장된 OpenRouter API 키를 삭제하면 채팅을 시작하기 전에
                      다시 입력해야 합니다. 삭제할까요?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>취소</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteApiKey}>
                      삭제하기
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </form>
        </Panel>

        <Panel
          description="무료 모델만 필터링해 기본 모델로 저장할 준비를 합니다."
          title="기본 모델"
        >
          <div className="grid gap-3">
            <Select
              key={settings?.defaultModelId ?? 'default-model-empty'}
              defaultValue={settings?.defaultModelId ?? undefined}
              disabled={
                !hasSavedApiKey ||
                freeModelsQuery.isPending ||
                freeModels.length === 0
              }
              onValueChange={handleDefaultModelChange}
            >
              <SelectTrigger>
                <div className="flex items-center gap-2">
                  <SlidersHorizontalIcon className="size-4 text-[var(--color-text-muted)]" />
                  <SelectValue
                    placeholder={
                      freeModelsQuery.isPending
                        ? '무료 모델을 불러오는 중입니다.'
                        : '무료 모델 선택'
                    }
                  />
                </div>
              </SelectTrigger>
              <SelectContent>
                {freeModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name ?? model.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="rounded-2xl border border-[var(--color-border)] px-4 py-3 text-sm text-[var(--color-text-muted)]">
              {!hasSavedApiKey
                ? 'API 키를 저장하면 무료 모델을 불러올 수 있습니다.'
                : (selectedModelName ?? '기본값은 아직 선택되지 않았습니다.')}
            </div>
          </div>
        </Panel>

        <Panel
          description="전역 시스템 프롬프트는 모든 새 대화의 기본값으로 사용됩니다."
          title="시스템 프롬프트"
        >
          <div className="grid gap-3">
            <Textarea
              className="min-h-32 rounded-2xl border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-panel)_86%,black)] px-4 py-3 text-base leading-7 text-[var(--color-text)] placeholder:text-[var(--color-text-muted)]"
              onChange={handleSystemPromptChange}
              placeholder="예: 모든 답변은 한국어로 간결하게 작성해 주세요."
              value={defaultSystemPrompt}
            />
            <p className="text-sm text-[var(--color-text-muted)]">
              이 설정은 새 대화의 기본값으로만 사용됩니다.
            </p>
          </div>
        </Panel>

        <Panel
          description="시스템 기본값은 다크 모드이며, 수동 전환도 가능합니다."
          title="테마"
        >
          <div className="grid gap-3 sm:grid-cols-3">
            {themeOptions.map((option) => (
              <Button
                key={option.value}
                className="h-auto min-h-20 flex-col items-start rounded-2xl border-[var(--color-border)] px-4 py-4 text-left hover:bg-[color-mix(in_srgb,var(--color-panel)_82%,white)]"
                onClick={() => setThemePreference(option.value)}
                type="button"
                variant={
                  themePreference === option.value ? 'default' : 'outline'
                }
              >
                <div className="flex items-center gap-2">
                  <PaletteIcon className="size-4" />
                  <span className="text-sm font-medium">{option.label}</span>
                </div>
                <span className="pt-2 text-sm leading-6 text-[var(--color-text-muted)]">
                  {option.description}
                </span>
              </Button>
            ))}
          </div>
        </Panel>
      </div>
    </section>
  );
}

type PanelProps = {
  children: React.ReactNode;
  description: string;
  title: string;
};

function Panel({ children, description, title }: PanelProps) {
  return (
    <div className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-panel)] px-5 py-5 sm:px-6">
      <div className="pb-5">
        <h2 className="text-xl font-semibold text-[var(--color-text)]">
          {title}
        </h2>
        <p className="pt-2 text-sm leading-6 text-[var(--color-text-muted)]">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

function StatusMessage({ message, tone }: StatusState) {
  const icon =
    tone === 'success' ? (
      <CircleCheckIcon className="mt-0.5 size-4 shrink-0" />
    ) : tone === 'error' ? (
      <CircleAlertIcon className="mt-0.5 size-4 shrink-0" />
    ) : (
      <KeyRoundIcon className="mt-0.5 size-4 shrink-0 text-[var(--color-accent)]" />
    );

  const colorClass =
    tone === 'success'
      ? 'text-emerald-300'
      : tone === 'error'
        ? 'text-red-300'
        : 'text-[var(--color-text-muted)]';

  return (
    <div
      aria-live="polite"
      className={`flex items-start gap-2 text-sm ${colorClass}`}
      role="status"
    >
      {icon}
      <span>{message}</span>
    </div>
  );
}
