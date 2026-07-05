from decimal import Decimal, ROUND_HALF_UP


def money(v):
    return Decimal(v).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def calculate_splits(total, participants, method, payload):
    total = money(total)
    ids = [str(p) for p in participants]
    if not ids:
        raise ValueError("At least one participant is required.")
    if method == "equal":
        base = money(total / len(ids))
        rows = {u: base for u in ids}
        rows[ids[-1]] = money(total - sum(rows[u] for u in ids[:-1]))
        return rows
    if method in {"exact", "custom"}:
        rows = {str(k): money(v) for k, v in payload.items()}
    elif method == "percentage":
        rows = {
            str(k): money(total * Decimal(str(v)) / Decimal("100"))
            for k, v in payload.items()
        }
    elif method == "shares":
        shares = {str(k): Decimal(str(v)) for k, v in payload.items()}
        denom = sum(shares.values())
        rows = {k: money(total * s / denom) for k, s in shares.items()}
    else:
        raise ValueError("Unsupported split method.")
    if money(sum(rows.values())) != total:
        raise ValueError("Split amounts must equal expense total.")
    return rows


def simplify_balances(expenses, payments=()):
    balances = {}
    for e in expenses:
        balances[e.paid_by_id] = balances.get(e.paid_by_id, Decimal("0.00")) + e.amount
        for s in e.splits.all():
            balances[s.user_id] = balances.get(s.user_id, Decimal("0.00")) - s.amount
    for p in payments:
        balances[p.payer_id] = balances.get(p.payer_id, Decimal("0.00")) + p.amount
        balances[p.payee_id] = balances.get(p.payee_id, Decimal("0.00")) - p.amount
    debtors = sorted(
        [(u, -a) for u, a in balances.items() if a < 0], key=lambda x: x[1]
    )
    creditors = sorted(
        [(u, a) for u, a in balances.items() if a > 0], key=lambda x: x[1]
    )
    out = []
    i = j = 0
    while i < len(debtors) and j < len(creditors):
        amt = money(min(debtors[i][1], creditors[j][1]))
        out.append({"from": debtors[i][0], "to": creditors[j][0], "amount": amt})
        debtors[i] = (debtors[i][0], debtors[i][1] - amt)
        creditors[j] = (creditors[j][0], creditors[j][1] - amt)
        i += debtors[i][1] == 0
        j += creditors[j][1] == 0
    return out
