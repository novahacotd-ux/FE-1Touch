
import React, { useState, useMemo } from "react";
import { FiX, FiUsers, FiShield, FiRefreshCw, FiCheckCircle } from "react-icons/fi";
import { MOCK_PARENTS, MOCK_USERS } from "../../data/mockData";
import Select from "../../../dashboard/admin/components/ui/Select";
import Checkbox from "../../../dashboard/admin/components/ui/Checkbox";

export default function ModalParentForm({ modal, onClose, onAudit, onMutate }) {
  const { studentId, parentId } = modal.payload || {};
  const current = parentId ? MOCK_PARENTS.find((p) => p.id === parentId) : null;

  const currentUser = current?.user_id ? MOCK_USERS.find((u) => u.id === current.user_id) : null;

  // Parent profile (ERD: parents)
  const [full_name, setName] = useState(current?.full_name || "");
  const [phone, setPhone] = useState(current?.phone || "");
  const [zalo_id, setZalo] = useState(current?.zalo_id || "");
  const [is_primary, setPrimary] = useState(!!current?.is_primary);

  const [accountMode, setAccountMode] = useState(
    current?.user_id ? "existing" : "create"
  );

  // For create/link
  const [username, setUsername] = useState(currentUser?.username || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [accPhone, setAccPhone] = useState(currentUser?.phone || phone || "");
  const [loginMethod, setLoginMethod] = useState(currentUser?.login_method || "OTP"); // OTP default
  const [status, setStatus] = useState(currentUser?.status || "ACTIVE");

  // for link existing: pick from list
  const parentUsers = useMemo(
    () => MOCK_USERS.filter((u) => u.role === "PARENT"),
    []
  );
  const [linkUserId, setLinkUserId] = useState(currentUser?.id || "");

  const err =
    !full_name.trim() ? "Thiếu họ tên phụ huynh" :
    (accountMode !== "none" && !username.trim() && accountMode === "create") ? "Thiếu username cho tài khoản phụ huynh" :
    null;

  const hasAccount = !!current?.user_id;

  const doLockUnlock = () => {
    if (!current?.user_id) return;
    const u = MOCK_USERS.find((x) => x.id === current.user_id);
    const next = u?.status === "LOCKED" ? "ACTIVE" : "LOCKED";
    onMutate.setUserStatus(current.user_id, next);
    onAudit(next === "LOCKED" ? "LOCK_PARENT_ACCOUNT" : "UNLOCK_PARENT_ACCOUNT", "users", current.user_id);
  };

  const [tempPwd, setTempPwd] = useState("");

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modalHead">
          <div className="strong">{parentId ? "Sửa phụ huynh + tài khoản" : "Thêm phụ huynh + tài khoản"}</div>
          <button className="iconBtn" onClick={onClose}><FiX /></button>
        </div>

        {/* Parent info */}
        <div className="panelSection" style={{ marginTop: 10 }}>
          <div className="panelSectionTitle"><FiUsers /> Thông tin phụ huynh (parents)</div>

          <div className="formRow">
            <label>Họ tên</label>
            <input className="input" value={full_name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="row" style={{ marginTop: 12 }}>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div className="formRow" style={{ marginTop: 0 }}>
                <label>Số điện thoại liên hệ</label>
                <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              <div className="formRow" style={{ marginTop: 0 }}>
                <label>Zalo ID</label>
                <input className="input" value={zalo_id} onChange={(e) => setZalo(e.target.value)} />
              </div>
            </div>
          </div>

          <label className="row" style={{ marginTop: 12 }}>
            <Checkbox 
              checked={is_primary} 
              onChange={(e) => setPrimary(e.target.checked)} 
              label="Đặt làm PRIMARY (mặc định nhận thông báo)" 
            />
          </label>

          {!phone.trim() && !zalo_id.trim() ? (
            <div className="muted" style={{ marginTop: 10 }}>
              Gợi ý: nên có ít nhất <b>phone</b> hoặc <b>zalo</b> để gửi cảnh báo.
            </div>
          ) : null}
        </div>

        {/* Account section (users) */}
        <div className="panelSection" style={{ marginTop: 12 }}>
          <div className="panelSectionTitle"><FiShield /> Tài khoản đăng nhập (users)</div>

          <div className="row" style={{ marginTop: 10 }}>
            <label className="row">
              <input
                type="radio"
                name="accMode"
                checked={accountMode === "create"}
                onChange={() => setAccountMode("create")}
              />
              <span className="muted">Tạo tài khoản mới</span>
            </label>

            <label className="row">
              <input
                type="radio"
                name="accMode"
                checked={accountMode === "link"}
                onChange={() => setAccountMode("link")}
              />
              <span className="muted">Liên kết tài khoản có sẵn</span>
            </label>

            <label className="row">
              <input
                type="radio"
                name="accMode"
                checked={accountMode === "none"}
                onChange={() => setAccountMode("none")}
              />
              <span className="muted">Không tạo tài khoản (chỉ lưu liên hệ)</span>
            </label>
          </div>

          {accountMode === "link" ? (
            <div className="formRow">
              <label>Chọn tài khoản phụ huynh (users.role=PARENT)</label>
              <Select 
                value={linkUserId} 
                onChange={setLinkUserId} 
                options={[
                  { value: "", label: "-- Chọn --" },
                  ...parentUsers.map(u => ({ value: u.id, label: `${u.username} • ${u.status}` }))
                ]} 
              />
            </div>
          ) : null}

          {accountMode === "create" ? (
            <>
              <div className="row" style={{ marginTop: 12 }}>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div className="formRow" style={{ marginTop: 0 }}>
                    <label>Username (duy nhất)</label>
                    <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="VD: parent_nguyenA" />
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div className="formRow" style={{ marginTop: 0 }}>
                    <label>Email (tuỳ chọn)</label>
                    <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="row" style={{ marginTop: 12 }}>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div className="formRow" style={{ marginTop: 0 }}>
                    <label>Phone (đề xuất dùng cho OTP)</label>
                    <input className="input" value={accPhone} onChange={(e) => setAccPhone(e.target.value)} />
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div className="formRow" style={{ marginTop: 0 }}>
                    <label>Phương thức đăng nhập</label>
                    <Select 
                      value={loginMethod} 
                      onChange={setLoginMethod} 
                      options={[
                        { value: "OTP", label: "OTP" },
                        { value: "PASSWORD", label: "PASSWORD" },
                      ]} 
                    />
                  </div>
                </div>
              </div>

              <div className="row" style={{ marginTop: 12 }}>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div className="formRow" style={{ marginTop: 0 }}>
                    <label>Trạng thái tài khoản</label>
                    <Select 
                      value={status} 
                      onChange={setStatus} 
                      options={[
                        { value: "ACTIVE", label: "ACTIVE" },
                        { value: "LOCKED", label: "LOCKED" },
                      ]} 
                    />
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div className="muted" style={{ marginTop: 18 }}>
                    Nếu chọn PASSWORD, hệ thống sẽ tạo <b>mật khẩu tạm</b> khi bạn bấm “Lưu”.
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {hasAccount ? (
            <div className="row" style={{ marginTop: 12 }}>
              <button className="btn btn-ghost" onClick={doLockUnlock}>
                <FiShield /> {currentUser?.status === "LOCKED" ? "Mở khoá tài khoản" : "Khoá tài khoản"}
              </button>

              <button
                className="btn btn-ghost"
                onClick={() => {
                  const temp = onMutate.resetUserPassword(current.user_id);
                  setTempPwd(temp || "");
                  onAudit("RESET_PARENT_PASSWORD", "users", current.user_id);
                }}
              >
                <FiRefreshCw /> Reset mật khẩu
              </button>

              {tempPwd ? (
                <span className="pill pill--warn">
                  <FiCheckCircle /> Temp: <span className="mono">{tempPwd}</span>
                </span>
              ) : null}
            </div>
          ) : null}
        </div>

        {err ? (
          <div className="muted" style={{ marginTop: 10, color: "rgba(239,68,68,.95)" }}>
            {err}
          </div>
        ) : null}

        {/* Actions */}
        <div className="modalActions">
          <button className="btn btn-ghost" onClick={onClose}>Huỷ</button>

          <button
            className="btn"
            disabled={!!err}
            onClick={() => {
              // 1) decide user_id
              let userId = current?.user_id || null;

              if (accountMode === "none") {
                userId = null;
              }

              if (accountMode === "link") {
                if (!linkUserId) return; // require selection
                userId = linkUserId;
              }

              if (accountMode === "create") {
                // validate username unique (mock)
                const dupe = MOCK_USERS.find((u) => u.username.toLowerCase() === username.trim().toLowerCase());
                const allow = !dupe || (currentUser && dupe.id === currentUser.id);
                if (!allow) {
                  alert("Username đã tồn tại. Hãy chọn username khác."); // minimal
                  return;
                }

                // create user nếu chưa có
                if (!userId) {
                  const tempPass = loginMethod === "PASSWORD"
                    ? `Temp${Math.random().toString(36).slice(2, 8)}!`
                    : ""; // OTP => không cần password

                  userId = onMutate.upsertUser({
                    username: username.trim(),
                    password: tempPass,
                    full_name: full_name.trim(),
                    email: email.trim(),
                    phone: (accPhone || "").trim(),
                    role: "PARENT",
                    status,
                    login_method: loginMethod,
                  });

                  onAudit("CREATE_PARENT_ACCOUNT", "users", userId);

                  if (loginMethod === "PASSWORD" && tempPass) setTempPwd(tempPass);
                } else {
                  // update user info (đồng bộ khi sửa phụ huynh)
                  onMutate.upsertUser({
                    id: userId,
                    full_name: full_name.trim(),
                    email: email.trim(),
                    phone: (accPhone || "").trim(),
                    status,
                    login_method: loginMethod,
                  });
                  onAudit("UPDATE_PARENT_ACCOUNT", "users", userId);
                }
              }

              // 2) upsert parent (parents)
              const pid = onMutate.upsertParent({
                studentId,
                parentId,
                data: {
                  user_id: userId,
                  full_name: full_name.trim(),
                  phone: phone.trim(),
                  zalo_id: zalo_id.trim(),
                  is_primary,
                },
              });

              onAudit(parentId ? "UPDATE_PARENT" : "ADD_PARENT", "parents", pid);
              onClose();
            }}
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
