const fs = require("fs");
const yaml = require("js-yaml");
const exec = require("child_process").exec;

/**
 * ************** CONFIG ******************
 */
const homePath = "/home/{{USER}}";

const hostFilePath = `${homePath}/.cpanel/datastore/ssl_FETCHINSTALLEDHOSTS`;
const sslFilePath = `${homePath}/ssl/ssl.db`;
const virtualFilePath =
  "/usr/local/apache/conf/includes/pre_virtualhost_global.conf";

// -----------------------------------------------
const parseVirtualHosts = (fileContents) => {
  const regex = /<VirtualHost\s+(.*?)>(.*?)<\/VirtualHost>/gs;

  const virtualHosts = [];
  let match;
  while ((match = regex.exec(fileContents)) !== null) {
    virtualHosts.push({ host: match[0], index: match.index });
  }

  if (virtualHosts.length > 0) {
    const domainRegex = /ServerName +(.+)/i;
    const certificateFileRegex = /SSLCertificateFile +(\/.+\.crt)/i;
    const certificateKeyRegex = /SSLCertificateKeyFile +(\/.+\.key)/i;

    const parsedData = virtualHosts
      .map(({ host, index }) => {
        const domainMatch = host.match(domainRegex);
        const certificateFileMatch = host.match(certificateFileRegex);
        const certificateKeyMatch = host.match(certificateKeyRegex);

        if (domainMatch && certificateFileMatch && certificateKeyMatch) {
          return {
            domain: domainMatch?.[1] || "",
            oldCartFilePath: certificateFileMatch?.[1] || "",
            oldKeyFilePath: certificateKeyMatch?.[1] || "",
            index,
          };
        }
      })
      .filter(Boolean);

    return parsedData;
  }

  return [];
};

// -----------------------------------------------
const getCertificate = (domain, sslData, hostData) => {
  const certData =
    hostData?.data?.hosts.find((host) => host.servername === domain) || null;

  if (certData?.certificate) {
    const cartFileName = certData.certificate.id;

    const keyFileName =
      Object.values(sslData.files.key).find(
        (key) => key.modulus === certData.certificate.modulus
      )?.id || null;

    return {
      newCartFilePath: `${homePath}/ssl/certs/${cartFileName}.crt`,
      newKeyFilePath: `${homePath}/ssl/keys/${keyFileName}.key`,
    };
  }

  return null;
};

// -----------------------------------------------
const replaceAfterIndex = (str, startIndex, searchStr, replaceStr) => {
  return (
    str.substring(0, startIndex) +
    str.substring(startIndex).replace(searchStr, replaceStr)
  );
};

// -----------------------------------------------
try {
  const hostFile = fs.readFileSync(hostFilePath, "utf8");
  const hostData = JSON.parse(hostFile);

  const sslDbFile = fs.readFileSync(sslFilePath, "utf8");
  const sslData = yaml.load(sslDbFile);

  let virtualData = fs.readFileSync(virtualFilePath, "utf8");
  const virtualHosts = parseVirtualHosts(virtualData);

  let resetApache = false;

  virtualHosts.forEach(({ domain, oldCartFilePath, oldKeyFilePath, index }) => {
    const result = getCertificate(domain, sslData, hostData);
    if (!result) return;

    const { newCartFilePath, newKeyFilePath } = result;

    if (oldCartFilePath !== newCartFilePath) {
      virtualData = replaceAfterIndex(
        virtualData,
        index,
        oldCartFilePath,
        newCartFilePath
      );
      resetApache = true;
    }

    if (oldKeyFilePath !== newKeyFilePath) {
      virtualData = replaceAfterIndex(
        virtualData,
        index,
        oldKeyFilePath,
        newKeyFilePath
      );
      resetApache = true;
    }
  });

  if (resetApache) {
    fs.writeFileSync(virtualFilePath, virtualData);
    console.log("Changed", new Date());

    exec("/bin/systemctl restart httpd.service", (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        return;
      }

      console.log(stdout, "Apache restart", new Date());
    });
  } else {
    console.log("No change", new Date());
  }
} catch (e) {
  console.error(e);
}
