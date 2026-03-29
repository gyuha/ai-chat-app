export const copyText = async (value: string) => {
  const clipboard = window.navigator.clipboard as {
    writeText?: (input: string) => Promise<void>;
  };

  if (typeof clipboard?.writeText === 'function') {
    await clipboard.writeText(value);
    return true;
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  document.body.removeChild(textarea);
  return copied;
};
