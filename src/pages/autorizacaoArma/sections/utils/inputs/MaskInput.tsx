// ./utils/MaskInput.tsx
import React from 'react';
import { IMaskInput } from 'react-imask';

interface MaskInputProps {
  mask: string;
  inputRef: React.Ref<HTMLInputElement>;
  name: string;
  value?: string;
  unmask?: boolean;
  onChange: (event: { target: { name: string; value: string } }) => void;
}

const MaskInput = React.forwardRef<HTMLElement, MaskInputProps>(
  function MaskInput(props, ref) {
    const { mask, inputRef, onChange, value = "", unmask = false, ...other } = props;

    return (
      <IMaskInput
        {...other}
        mask={mask}
        inputRef={inputRef}
        value={value}
        unmask={unmask}
        onAccept={(value: any) =>
          onChange({ target: { name: props.name, value } })
        }
        overwrite
      />
    );
  }
);

export default MaskInput;
