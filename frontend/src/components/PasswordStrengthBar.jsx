const getStrength = (pw) => {
    if (!pw) return { level: 0, label: "" };

    let score = 0;

    if (pw.length >= 8) score++;
    if (pw.length >= 12) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;

    if (score <= 1) return { level: 1, label: "Weak" };
    if (score <= 2) return { level: 2, label: "Fair" };
    if (score <= 3) return { level: 3, label: "Good" };

    return { level: 4, label: "Strong" };
};

const colorVars = {
    1: "#ef4444",
    2: "#f59e0b",
    3: "#3b82f6",
    4: "#22c55e",
};

export const PasswordStrengthBar = ({ password }) => {
    const { level, label } = getStrength(password);

    if (!password) return null;

    return (
        <div className="mt-2 space-y-1">
            <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                    <div
                        key={i}
                        className="h-1.5 flex-1 rounded-full transition-all duration-300"
                        style={{
                            backgroundColor:
                                i <= level ? colorVars[level] : "#e5e7eb",
                        }}
                    />
                ))}
            </div>

            <p
                className="text-xs font-medium"
                style={{ color: colorVars[level] }}
            >
                {label}
            </p>
        </div>
    );
};