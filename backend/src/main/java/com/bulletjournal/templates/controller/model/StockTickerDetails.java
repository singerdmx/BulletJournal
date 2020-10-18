package com.bulletjournal.templates.controller.model;

public class StockTickerDetails {
    private String ticker;
    private String details;
    private Selection selection;
    private String logo;
    private String country;
    private String industry;
    private Long marketCap;
    private Long employees;
    private String phone;
    private String ceo;
    private String url;
    private String description;
    private String exchange;
    private String name;
    private String exchangeSymbol;
    private String hqAddress;
    private String hqState;
    private String hqCountry;
    private String[] tags;
    private String[] similar;

    public StockTickerDetails() {
    }


    public StockTickerDetails(String ticker, String details, Selection selection, String logo,
                              String country, String industry, Long marketCap, Long employees,
                              String phone, String ceo, String url, String description, String exchange,
                              String name, String exchangeSymbol, String hqAddress, String hqState,
                              String hqCountry, String[] tags, String[] similar) {
        this.ticker = ticker;
        this.details = details;
        this.selection = selection;
        this.logo = logo;
        this.country = country;
        this.industry = industry;
        this.marketCap = marketCap;
        this.employees = employees;
        this.phone = phone;
        this.ceo = ceo;
        this.url = url;
        this.description = description;
        this.exchange = exchange;
        this.name = name;
        this.exchangeSymbol = exchangeSymbol;
        this.hqAddress = hqAddress;
        this.hqState = hqState;
        this.hqCountry = hqCountry;
        this.tags = tags;
        this.similar = similar;
    }

    public StockTickerDetails(String ticker, String details, Selection selection) {
        this.ticker = ticker;
        this.details = details;
        this.selection = selection;
    }

    public String getTicker() {
        return ticker;
    }

    public void setTicker(String ticker) {
        this.ticker = ticker;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public Selection getSelection() {
        return selection;
    }

    public void setSelection(Selection selection) {
        this.selection = selection;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public Long getMarketCap() {
        return marketCap;
    }

    public void setMarketCap(Long marketCap) {
        this.marketCap = marketCap;
    }

    public Long getEmployees() {
        return employees;
    }

    public void setEmployees(Long employees) {
        this.employees = employees;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getCeo() {
        return ceo;
    }

    public void setCeo(String ceo) {
        this.ceo = ceo;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getExchange() {
        return exchange;
    }

    public void setExchange(String exchange) {
        this.exchange = exchange;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getExchangeSymbol() {
        return exchangeSymbol;
    }

    public void setExchangeSymbol(String exchangeSymbol) {
        this.exchangeSymbol = exchangeSymbol;
    }

    public String getHqAddress() {
        return hqAddress;
    }

    public void setHqAddress(String hqAddress) {
        this.hqAddress = hqAddress;
    }

    public String getHqState() {
        return hqState;
    }

    public void setHqState(String hqState) {
        this.hqState = hqState;
    }

    public String getHqCountry() {
        return hqCountry;
    }

    public void setHqCountry(String hqCountry) {
        this.hqCountry = hqCountry;
    }

    public String[] getTags() {
        return tags;
    }

    public void setTags(String[] tags) {
        this.tags = tags;
    }

    public String[] getSimilar() {
        return similar;
    }

    public void setSimilar(String[] similar) {
        this.similar = similar;
    }
}
