import { Inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { DOCUMENT } from "@angular/common";
import { FuseSplashScreenService } from "@fuse/services/splash-screen";
@Injectable({
    providedIn: "root",
})
export class TranslationService {
    public language = new BehaviorSubject("");
    public _languageBehaviorSubject$ = new BehaviorSubject<{
        lang: string;
    }>({
        lang: "en",
    });

    get currentLang(): string {
        return this._languageBehaviorSubject$.value.lang;
    }
    get isEnglish(): boolean {
        return this._languageBehaviorSubject$.value.lang == "en";
    }

    get isArabic(): boolean {
        return this._languageBehaviorSubject$.value.lang == "ar";
    }
    constructor(
        private translateService: TranslateService,
        @Inject(DOCUMENT) private document: Document,
        private fuseSplashScreenService: FuseSplashScreenService
    ) {
        this.getLanguageStorage().then((lang) => {
            this._languageBehaviorSubject$.next({ lang });
            console.log("Initialized lang", lang);
        });
    }
    getOppositeDirection(): string {
        return this.isArabic ? "ltr" : "rtl";
    }

    async useLanguage(lang, isShowSplash = false) {
        if (lang == this.translateService.currentLang) {
            return;
        }
        if (isShowSplash) {
            await this.showSplashScreen();
        }
        this.translateService.use(lang);
        this._languageBehaviorSubject$.next({ lang });

        this.translateService.setDefaultLang(lang);
        this.document.dir = this.getDirection();
        this.document.documentElement.lang = lang;
        this.document.documentElement.classList.remove(
            this.getOppositeDirection()
        );
        this.document.documentElement.classList.add(this.getDirection());

        this.document.body.dir = this.getDirection();
        this.document.body.lang = lang;
        this.document.body.classList.remove(this.getOppositeDirection());
        this.document.body.classList.add(this.getDirection());
        this.language.next(lang);
        this.setLanguageStorage(lang);

        if (isShowSplash) {
            setTimeout(() => {
                location.reload();
            }, 800);
        }
    }
    async showSplashScreen() {
        this.fuseSplashScreenService.show();
    }

    async getLanguageStorage() {
        let storageLanguage = localStorage.getItem("language");
        return storageLanguage ? storageLanguage : "en";
    }

    async setLanguageStorage(lang: string) {
        return await localStorage.setItem("language", lang);
    }

    getDirection(): string {
        this.setDirectionToLocalStorage();
        return this.isArabic ? "rtl" : "ltr";
    }
    setDirectionToLocalStorage() {
        localStorage.setItem("dir", this.isArabic ? "rtl" : "ltr");
    }

    async toggleLanguage() {
        this.isArabic
            ? await this.setLanguageStorage("en")
            : await this.setLanguageStorage("ar");
    }
    getCurrentLang(): string {
        return this._languageBehaviorSubject$.value.lang;
    }
    getTranslatedName(item: any): string {
        return item
            ? this.isArabic
                ? item.name_ar
                    ? item.name_ar
                    : item.name_en
                : item.name_en
                ? item.name_en
                : item.name_ar
            : "";
    }
    getOnlyTranslatedNameNotName_en(item: any) {
        return item
            ? this.isArabic
                ? item.name_ar
                    ? item.name_ar
                    : item.name
                : item.name
                ? item.name
                : item.name_ar
            : "";
    }
    getTranslatedValue(item: any): string {
        return item
            ? this.isArabic
                ? item.value_ar
                    ? item.value_ar
                    : item.value_en
                : item.value_en
                ? item.value_en
                : item.value_ar
            : "";
    }

    getTranslatedDescription(item: any) {
        return item
            ? this.isArabic
                ? item.description_ar
                    ? item.description_ar
                    : item.description
                : item.description_en
                ? item.description_en
                : item.description
            : "";
    }

    getTranslatedGeneric(item: any) {
        return item ? (this.isArabic ? item.ar : item.en) : "";
    }

    getTranslatedBody(item: any) {
        return item
            ? this.isArabic
                ? item.body_ar
                    ? item.body_ar
                    : item.body
                : item.body_en
                ? item.body_en
                : item.body
            : "";
    }
    getTranslatedField(item: any, field_name: string) {
        return item
            ? this.isArabic
                ? item?.[`${field_name}_ar`]
                    ? item?.[`${field_name}_ar`]
                    : item?.[`${field_name}`]
                : item?.[`${field_name}_en`]
                ? item?.[`${field_name}_en`]
                : item?.[`${field_name}`]
            : "";
    }
    getTranslatedMenu(item: any) {
        return item
            ? this.isArabic
                ? item.menu_text_ar
                    ? item.menu_text_en
                    : item.menu_text_en
                : item.menu_text_en
                ? item.menu_text_en
                : item.menu_text_ar
            : "";
    }

    getTranslatedTitle(item: any) {
        return item
            ? this.isArabic
                ? item.title_ar
                    ? item.title_ar
                    : item.title
                : item.title_en
                ? item.title_en
                : item.title
            : "";
    }
    getTranslatedNotes(item: any) {
        return item
            ? this.isArabic
                ? item.notes_ar
                    ? item.notes_ar
                    : item.notes
                : item.notes_en
                ? item.notes_en
                : item.notes
            : "";
    }
    getTranslatedmetaTitle(item: any) {
        return item
            ? this.isArabic
                ? item.meta_title_ar
                    ? item.notemeta_title_ars_ar
                    : item.meta_title_en
                : item.meta_title_en
                ? item.meta_title_en
                : item.meta_title_ar
            : "";
    }
    getTranslatedRenderedMessage(item: any) {
        return item
            ? this.isArabic
                ? item.rendered_message_ar
                    ? item.rendered_message_ar
                    : item.rendered_message
                : item.rendered_message_en
                ? item.rendered_message_en
                : item.rendered_message
            : "";
    }

    getTranslatedMessage(item: any) {
        return item
            ? this.isArabic
                ? item.message_ar
                    ? item.message_ar
                    : ""
                : item.message_en
                ? item.message_en
                : ""
            : "";
    }
    getTranslatedmetaDescription(item: any) {
        return item
            ? this.isArabic
                ? item.meta_description_ar
                    ? item.meta_description_ar
                    : item.meta_description_en
                : item.meta_description_en
                ? item.meta_description_en
                : item.meta_description_ar
            : "";
    }
}
