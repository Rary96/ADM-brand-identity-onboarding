"use client";

import type { StepQuestion } from "@/lib/questionnaire-steps";
import type { Questionario } from "@/lib/schema";
import {
  TextShortField,
  TextLongField,
  EmailFieldInput,
  DateFieldInput,
  SingleChoiceField,
} from "@/components/questionnaire/fields/SimpleFields";
import { ChipsField } from "@/components/questionnaire/fields/ChipsField";
import { PillMultiSelectField } from "@/components/questionnaire/fields/PillMultiSelectField";
import { PriceScaleField } from "@/components/questionnaire/fields/PriceScaleField";
import { ToneScaleField } from "@/components/questionnaire/fields/ToneScaleField";
import { GridPositionField } from "@/components/questionnaire/fields/GridPositionField";
import { UploadLinkField } from "@/components/questionnaire/fields/UploadLinkField";
import { ColorField } from "@/components/questionnaire/fields/ColorField";
import { SupportsField } from "@/components/questionnaire/fields/SupportsField";
import { DeadlineField } from "@/components/questionnaire/fields/DeadlineField";
import { Textarea } from "@/components/ui/textarea";

interface FieldRendererProps {
  question: StepQuestion;
  value: unknown;
  onChange: (value: unknown) => void;
}

export function FieldRenderer({ question, value, onChange }: FieldRendererProps) {
  switch (question.id) {
    case "valori":
    case "canaliVendita": {
      const v = (value as { selezionati: string[]; altro?: string } | undefined) ?? {
        selezionati: [],
        altro: "",
      };
      return (
        <ChipsField
          values={v.selezionati}
          onChange={(selezionati) => onChange({ ...v, selezionati })}
          placeholder="Scrivi e premi Invio per aggiungere"
          altro={v.altro}
          onAltroChange={(altro) => onChange({ ...v, altro })}
          altroLabel="Altro (facoltativo)"
        />
      );
    }
    case "emozioneLogo": {
      const v = (value as string[] | undefined) ?? [];
      return (
        <PillMultiSelectField
          options={question.options ?? []}
          values={v}
          onChange={onChange}
          max={2}
        />
      );
    }
    case "posizionamentoPrezzo":
      return (
        <PriceScaleField
          options={question.options ?? []}
          value={value as string | undefined}
          onChange={onChange}
        />
      );
    case "mappaPosizionamento":
      return (
        <GridPositionField
          value={value as Questionario["mappaPosizionamento"]}
          onChange={onChange}
        />
      );
    case "toneEParole": {
      const v = (value as Questionario["toneEParole"]) ?? {};
      return <ToneScaleField value={v} onChange={onChange} />;
    }
    case "loghiRiferimento":
    case "stiliDaEvitare":
    case "assetEsistenti": {
      const v = (value as { urls: string[]; note?: string } | undefined) ?? { urls: [], note: "" };
      return <UploadLinkField fieldId={question.id} value={v} onChange={onChange} />;
    }
    case "colori": {
      const v = (value as Questionario["colori"]) ?? { preferiti: [], daEvitare: [], note: "" };
      return <ColorField value={v} onChange={onChange} />;
    }
    case "supportiEVincoli": {
      const v = (value as Questionario["supportiEVincoli"]) ?? {
        supporti: { selezionati: [], altro: "" },
        vincoliTecnici: "",
      };
      return <SupportsField options={question.options ?? []} value={v} onChange={onChange} />;
    }
    case "formatiRichiesti": {
      const v = (value as { selezionati: string[]; altro?: string } | undefined) ?? {
        selezionati: [],
        altro: "",
      };
      return (
        <div className="flex flex-col gap-6">
          <PillMultiSelectField
            options={question.options ?? []}
            values={v.selezionati}
            onChange={(selezionati) => onChange({ ...v, selezionati })}
          />
          <Textarea
            value={v.altro ?? ""}
            onChange={(e) => onChange({ ...v, altro: e.target.value })}
            placeholder="Altro formato non in lista (facoltativo)"
            rows={2}
            className="resize-none border-0 border-b-2 border-neutral-200 rounded-none px-1 text-base focus-visible:ring-0 focus-visible:border-accent-400"
          />
        </div>
      );
    }
    case "scadenza": {
      const v = (value as Questionario["scadenza"]) ?? { data: "", note: "" };
      return <DeadlineField value={v} onChange={onChange} />;
    }
    default:
      break;
  }

  switch (question.type) {
    case "text-short":
      return (
        <TextShortField
          value={(value as string) ?? ""}
          onChange={onChange}
        />
      );
    case "text-long":
      return <TextLongField value={(value as string) ?? ""} onChange={onChange} />;
    case "email":
      return (
        <EmailFieldInput
          value={(value as string) ?? ""}
          onChange={onChange}
        />
      );
    case "single-choice":
      return (
        <SingleChoiceField
          options={question.options ?? []}
          value={value as string | undefined}
          onChange={onChange}
        />
      );
    case "date":
      return <DateFieldInput value={value as string | undefined} onChange={onChange} />;
    default:
      return null;
  }
}
