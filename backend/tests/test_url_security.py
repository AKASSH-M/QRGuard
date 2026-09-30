import pytest

from url_security_service import (
    analyze_url_security,
    calculate_shannon_entropy,
    get_suspicious_keywords,
    google_web_risk_lookup,
    openphish_lookup,
    phishtank_lookup,
    validate_url_for_fetch,
)


def test_normal_url_features():
    result = analyze_url_security('https://example.com/login')
    assert result['url_length'] == len('https://example.com/login')
    assert result['path_depth'] >= 1
    assert result['https_verification']['enabled'] is True


def test_suspicious_keywords_are_detected():
    result = analyze_url_security('https://example.com/login?verify=account')
    assert result['suspicious_keyword_count']['count'] >= 2
    assert 'login' in result['suspicious_keyword_count']['matched']


def test_ip_address_url_detected():
    result = analyze_url_security('https://192.168.1.10/login')
    assert result['ip_address_presence']['present'] is True
    assert result['ip_address_presence']['value'] == '192.168.1.10'


def test_deep_path_counted():
    result = analyze_url_security('https://example.com/a/b/c/login')
    assert result['path_depth'] == 4


def test_entropy_is_numeric():
    value = calculate_shannon_entropy('https://login.example.com/reset/password')
    assert isinstance(value, float)
    assert value > 0


def test_rejects_private_ip_url_for_fetch():
    assert validate_url_for_fetch('http://127.0.0.1/login') is False
    assert validate_url_for_fetch('http://localhost/login') is False


def test_gives_unknown_for_invalid_url():
    result = analyze_url_security('not a real url')
    assert result['url_length'] >= 0
    assert result['domain_reputation']['source'] in {'unknown', 'unavailable'}


def test_keyword_list_is_configurable():
    keywords = get_suspicious_keywords()
    assert 'login' in keywords
    assert 'payment' in keywords


def test_https_flag_and_scheme_are_reported():
    result = analyze_url_security('http://example.com/login')
    assert result['https_verification']['enabled'] is False
    assert result['https_verification']['protocol'] == 'http'


def test_no_external_api_key_returns_unknown_not_safe():
    web_risk = google_web_risk_lookup('https://example.com')
    assert web_risk['available'] is False
    assert web_risk['threat_detected'] is None

    openphish = openphish_lookup('https://example.com')
    assert openphish['available'] in {True, False}

    phish = phishtank_lookup('https://example.com')
    assert phish['available'] in {True, False}
    assert phish['in_database'] is False
