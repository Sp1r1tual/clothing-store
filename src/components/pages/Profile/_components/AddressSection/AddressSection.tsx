"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";

import { getAddressAction, saveAddressAction } from "@/actions/address.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MapPin } from "lucide-react";

import { Button } from "@/components/ui/Button/Button";
import { Input } from "@/components/ui/Input/Input";

import {
  type AddressFormData,
  CARRIERS,
  type CarrierType,
  addressSchema,
} from "@/common/validation/profile/schemas/address.schema";

import styles from "./AddressSection.module.css";

export const AddressSection = () => {
  const t = useTranslations("Profile.address");
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState<AddressFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting, isValid, isDirty, isSubmitted },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { carrier: "NOVA_POSHTA", city: "", warehouse: "" },
  });

  const carrier = useWatch({ control, name: "carrier" });

  useEffect(() => {
    getAddressAction()
      .then((addr) => {
        if (addr && addr.carrier && ["NOVA_POSHTA", "UKRPOSHTA", "MEEST"].includes(addr.carrier)) {
          const formData: AddressFormData = {
            carrier: addr.carrier as CarrierType,
            city: addr.city,
            warehouse: addr.warehouse,
          };
          setSaved(formData);
          reset(formData);
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [reset]);

  const startEditing = () => {
    reset(saved ?? { carrier: "NOVA_POSHTA", city: "", warehouse: "" });
    setIsEditing(true);
  };

  const onSubmit = async (data: AddressFormData) => {
    try {
      const result = await saveAddressAction(data);
      if (
        result &&
        result.carrier &&
        ["NOVA_POSHTA", "UKRPOSHTA", "MEEST"].includes(result.carrier)
      ) {
        setSaved({
          carrier: result.carrier as CarrierType,
          city: result.city,
          warehouse: result.warehouse,
        });
      }
      toast.success(t("success"));
      setIsEditing(false);
    } catch {
      toast.error(t("error"));
    }
  };

  const carrierLabel = (c: CarrierType) => t(`carriers.${c}`);
  const displayCarrier = saved?.carrier ? carrierLabel(saved.carrier) : null;

  if (isLoading) return null;

  return (
    <div className={styles.section}>
      <AnimatePresence mode="wait">
        {isEditing ? (
          <motion.form
            key="edit"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit(onSubmit)}
            className={styles.form}
          >
            <input type="hidden" {...register("carrier")} />
            <h3 className={styles.sectionTitle}>{t("sectionTitle")}</h3>

            <div className={styles.field}>
              <span className={styles.fieldLabel}>{t("carrier")}</span>
              <div className={styles.carrierGroup}>
                {CARRIERS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`${styles.carrierChip} ${carrier === c ? styles.carrierChipActive : ""}`}
                    onClick={() =>
                      setValue("carrier", c, { shouldDirty: true, shouldValidate: true })
                    }
                  >
                    {carrierLabel(c)}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <Input
                label={t("city")}
                placeholder={t("cityPlaceholder")}
                {...register("city")}
                error={errors.city?.message}
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.field}>
              <Input
                label={t("warehouse")}
                placeholder={t("warehousePlaceholder")}
                {...register("warehouse")}
                error={errors.warehouse?.message}
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.formActions}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsEditing(false)}
                disabled={isSubmitting}
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !isDirty || (isSubmitted && !isValid)}
              >
                {isSubmitting ? <Loader2 size={16} className={styles.spinner} /> : t("save")}
              </Button>
            </div>
          </motion.form>
        ) : (
          <motion.div
            key="view"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className={styles.viewRow}
          >
            <div className={styles.iconWrapper}>
              <MapPin size={18} />
            </div>
            <div className={styles.info}>
              <span className={styles.fieldLabel}>{t("sectionTitle")}</span>
              {saved && saved.city ? (
                <span className={styles.value}>
                  {displayCarrier && <strong>{displayCarrier}</strong>}
                  {displayCarrier && " · "}
                  {saved.city}
                  {saved.warehouse && ` · ${saved.warehouse}`}
                </span>
              ) : (
                <span className={styles.notSet}>{t("notSet")}</span>
              )}
            </div>
            <button type="button" className={styles.editBtn} onClick={startEditing}>
              {t("edit")}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
