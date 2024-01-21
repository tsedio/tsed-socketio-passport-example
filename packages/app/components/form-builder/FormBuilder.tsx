import { FormioComponent, FormioForm } from "@tsed/formio-types";
import React, { PropsWithChildren } from "react";

import { Input } from "../input/Input.js";

export function FormBuilder({ form, children, ...props }: PropsWithChildren<{ form: FormioForm } & React.JSX.IntrinsicElements["form"]>) {
  return (
    <form {...props}>
      {form.components.map((component: FormioComponent) => {
        return (
          <Input
            label={component.label}
            key={component.key}
            id={component.key}
            name={component.key}
            type={component.type === "textfield" ? "text" : component.type}
            placeholder={component.placeholder}
            autoComplete={component.autocomplete}
            required={component.validate?.required}
            minLength={component.validate?.minLength}
            maxLength={component.validate?.maxLength}
          />
        );
      })}

      {children}
    </form>
  );
}
