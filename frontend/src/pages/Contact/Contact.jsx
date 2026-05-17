import React, { useCallback } from 'react';
import styles from './Contact.module.css';
import useSEO from '../../hooks/useSEO';
import Section from '../../components/ui/Section';
import RevealOnScroll from '../../components/ui/RevealOnScroll';
import Button from '../../components/ui/Button';
import FormField from '../../components/ui/form/FormField';
import Input from '../../components/ui/form/Input';
import Select from '../../components/ui/form/Select';
import Textarea from '../../components/ui/form/Textarea';
import useForm from '../../hooks/useForm';
import { submitContact } from '../../services/contactService';

const SERVICE_OPTIONS = [
  { value: '', label: 'Xidmət seçin' },
  { value: 'Performance Marketing', label: 'Performans Marketinqi' },
  { value: 'Brand Strategy', label: 'Brend Strategiyası' },
  { value: 'SMM', label: 'Sosial Media Marketinqi' },
  { value: 'SEO', label: 'SEO Optimizasiyası' },
  { value: 'Consulting', label: 'Konsaltinq' }
];

const BUDGET_OPTIONS = [
  { value: '', label: 'Büdcə aralığını seçin' },
  { value: 'Under $5k', label: '5.000$-dan aşağı' },
  { value: '$5k - $15k', label: '5.000$ - 15.000$' },
  { value: '$15k - $30k', label: '15.000$ - 30.000$' },
  { value: '$30k - $50k', label: '30.000$ - 50.000$' },
  { value: '$50k+', label: '50.000$+' }
];

const Contact = () => {
  useSEO({ title: 'Əlaqə | LeylaDigital', description: 'Rəqəmsal strategiya və veb inkişaf layihələri üçün bizimlə əlaqə saxlayın.' });

  const { values, errors, setErrors, handleChange, isSubmitting, setIsSubmitting, isSuccess, setIsSuccess, isError, setIsError, reset } = useForm({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    budget: '',
    subject: '',
    message: ''
  });

  const validate = () => {
    const newErrors = {};
    if (!values.name || values.name.length < 2) newErrors.name = 'Ad ən azı 2 simvoldan ibarət olmalıdır.';
    if (!values.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) newErrors.email = 'Düzgün e-poçt ünvanı daxil edin.';
    if (!values.message || values.message.length < 10) newErrors.message = 'Mesaj ən azı 10 simvoldan ibarət olmalıdır.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setIsError(false);

    try {
      await submitContact(values);
      setIsSuccess(true);
    } catch (error) {
      if (error.errors) {
        const fieldErrors = {};
        error.errors.forEach(err => { fieldErrors[err.field] = err.message; });
        setErrors(fieldErrors);
      } else {
        setIsError(error.message || 'Xəta baş verdi. Zəhmət olmasa bir az sonra yenidən cəhd edin.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Section bg="secondary" spacing="xl">
          <RevealOnScroll>
            <h1 className={styles.title}>Gəlin Birlikdə İşləyək</h1>
            <p className={styles.subtitle}>Bir layihəniz var? Gəlin onu necə böyütməyi müzakirə edək.</p>
          </RevealOnScroll>
        </Section>
      </header>

      <Section spacing="xl">
        <div className={styles.layout}>
          <div className={styles.infoPanel}>
            <RevealOnScroll>
              <h2 className={styles.panelTitle}>Əlaqə Məlumatları</h2>
              <p className={styles.panelSubtitle}>Bizimlə birbaşa əlaqə saxlayın və ya formu doldurun. 24 saat ərzində cavab verməyə çalışırıq.</p>

              <div className={styles.infoBlocks}>
                <div className={styles.infoBlock}>
                  <div className={styles.icon}>✉</div>
                  <div>
                    <h4 className={styles.infoLabel}>E-poçt</h4>
                    <p className={styles.infoValue}>hello@leyladigital.com</p>
                  </div>
                </div>
                <div className={styles.infoBlock}>
                  <div className={styles.icon}>💬</div>
                  <div>
                    <h4 className={styles.infoLabel}>WhatsApp</h4>
                    <p className={styles.infoValue}>+994 50 831 48 08</p>
                  </div>
                </div>
                <div className={styles.infoBlock}>
                  <div className={styles.icon}>📍</div>
                  <div>
                    <h4 className={styles.infoLabel}>Məkan</h4>
                    <p className={styles.infoValue}>Məsafədən / Qlobal</p>
                  </div>
                </div>
                <div className={styles.infoBlock}>
                  <div className={styles.icon}>⏱</div>
                  <div>
                    <h4 className={styles.infoLabel}>Cavab müddəti</h4>
                    <p className={styles.infoValue}>Adətən 24 saat ərzində</p>
                  </div>
                </div>
              </div>

              <div className={styles.availability}>
                <strong>Cari Status:</strong> Q3 üçün yeni layihələr qəbul edilir.
              </div>
            </RevealOnScroll>
          </div>

          <div className={styles.formArea} id="contact">
            {isSuccess ? (
              <RevealOnScroll className={styles.successState}>
                <div className={styles.successIcon}>✓</div>
                <h2 className={styles.successTitle}>Təşəkkür edirik!</h2>
                <p className={styles.successMessage}>Mesajınız qəbul edildi. 24 saat ərzində sizinlə əlaqə saxlayacağıq.</p>
                <Button variant="ghost" onClick={reset}>Başqa bir mesaj göndər</Button>
              </RevealOnScroll>
            ) : (
              <RevealOnScroll delay={100}>
                <form className={styles.form} onSubmit={handleSubmit}>
                  {isError && (
                    <div className={styles.globalError}>
                      {typeof isError === 'string' ? isError : 'Mesaj göndərilmədi.'}
                    </div>
                  )}

                  <div className={styles.gridRow}>
                    <FormField label="Ad və Soyad" id="name" error={errors.name} required>
                      <Input
                        id="name"
                        name="name"
                        value={values.name}
                        onChange={handleChange}
                        hasError={!!errors.name}
                        placeholder="Ceyhun Məmmədov"
                      />
                    </FormField>
                    <FormField label="E-poçt" id="email" error={errors.email} required>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={values.email}
                        onChange={handleChange}
                        hasError={!!errors.email}
                        placeholder="ceyhun@example.com"
                      />
                    </FormField>
                  </div>

                  <div className={styles.gridRow}>
                    <FormField label="Telefon (Könüllü)" id="phone">
                      <Input
                        id="phone"
                        name="phone"
                        value={values.phone}
                        onChange={handleChange}
                        placeholder="+994 (50) 000-00-00"
                      />
                    </FormField>
                    <FormField label="Şirkət (Könüllü)" id="company">
                      <Input
                        id="company"
                        name="company"
                        value={values.company}
                        onChange={handleChange}
                        placeholder="Şirkətinizin adı"
                      />
                    </FormField>
                  </div>

                  <div className={styles.gridRow}>
                    <FormField label="Maraqlandığınız Xidmət" id="service">
                      <Select
                        id="service"
                        name="service"
                        value={values.service}
                        onChange={handleChange}
                        options={SERVICE_OPTIONS}
                      />
                    </FormField>
                    <FormField label="Büdcə Aralığı" id="budget">
                      <Select
                        id="budget"
                        name="budget"
                        value={values.budget}
                        onChange={handleChange}
                        options={BUDGET_OPTIONS}
                      />
                    </FormField>
                  </div>

                  <FormField label="Mövzu" id="subject">
                    <Input
                      id="subject"
                      name="subject"
                      value={values.subject}
                      onChange={handleChange}
                      placeholder="Sizə necə kömək edə bilərik?"
                    />
                  </FormField>

                  <FormField label="Mesaj" id="message" error={errors.message} required>
                    <Textarea
                      id="message"
                      name="message"
                      value={values.message}
                      onChange={handleChange}
                      hasError={!!errors.message}
                      rows={5}
                      placeholder="Layihəniz haqqında danışın..."
                    />
                  </FormField>

                  <Button type="submit" variant="primary" size="lg" className={styles.submitBtn} isLoading={isSubmitting}>
                    Mesajı Göndər
                  </Button>
                </form>
              </RevealOnScroll>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
};
export default Contact;
