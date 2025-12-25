🧰 Bash Command Master Cheat-Sheet
For Homelab / Data-Center / Cloud Ops (Markdown Version)

1. File & Directory Operations
Command Usage Example Description
ls ls -lah List files with human-readable sizes
cd cd /path/to/dir Change directory
pwd pwd Show current directory
cp cp src dest Copy file
cp -r cp -r dir1 dir2 Copy directory recursively
mv mv old new Move/rename file
rm rm file Delete file
rm -rf rm -rf /dir Force delete directory
mkdir mkdir newdir Create directory
touch touch file.txt Create empty file
nano / vim nano file Text editor
2. File Viewing & Searching
Command Usage Example Description
cat cat file Print file
less less file Paginated viewer
head head -20 file First 20 lines
tail tail -50 file Last 50 lines
tail -f tail -f /var/log/syslog Live log follow
grep grep "text" file Search text in file
grep -R grep -R "word" /dir Recursive search
grep -n grep -n "text" file With line numbers
wc -l wc -l file Count lines
find find / -name "*.log" Find files
3. Permissions & Ownership
Command Usage Example Description
chmod chmod 755 file Change permissions
chown chown user:group file Change owner/group
useradd useradd username Add user
passwd passwd username Set password
groups groups user Show user groups
4. Process & System Management
Command Usage Example Description
top top Real-time monitor
htop htop Advanced process view
ps aux ps aux List running processes
kill PID kill 1234 Stop process
kill -9 PID kill -9 1234 Force kill
systemctl start systemctl start nginx Start service
systemctl stop systemctl stop sshd Stop service
systemctl restart systemctl restart docker Restart service
systemctl status systemctl status apache2 Service status
reboot Restart machine 
shutdown now Immediate shutdown 
5. Networking Commands
Command Usage Example Description
ip a ip a Show interfaces
ip r ip r Routing table
ping ping 8.8.8.8 Test network
curl curl <http://site.com> Fetch URL
wget wget <http://file> Download
ss -tulpn ss -tulpn Ports/listening services
dig dig domain.com DNS lookup
nslookup nslookup domain.com DNS lookup
traceroute traceroute google.com Network path
6. SSH & Remote Access
Command Usage Example Description
ssh ssh user@host Connect to server
ssh -i ssh -i key.pem user@host Login with key
scp scp file user@host:/path Copy to server
rsync rsync -avz src dest Sync directories
7. Disk / Storage / RAID / LVM
Command Usage Example Description
df -h Disk usage summary 
du -sh dir/ Folder size 
lsblk Show block devices 
fdisk /dev/sdb Partition disk 
mount /dev/sdb1 /mnt Mount partition 
umount /mnt Unmount 
pvcreate /dev/sdb1 LVM physical volume 
vgcreate vg1 /dev/sdb1 Volume group 
lvcreate -L 20G -n lv1 vg1 Logical volume 
mkfs.ext4 /dev/sdb1 Format disk 
8. Compression & Archives
Command Usage Example Description
tar -czvf tar -czvf backup.tgz /dir Create archive
tar -xzvf Extract archive 
unzip unzip file.zip Extract ZIP
gzip Compress 
gunzip Decompress 
9. Package Management
Debian/Ubuntu
Command Usage Example Description
apt update Update repo lists 
apt upgrade Upgrade all packages 
apt install pkg Install software 
apt remove pkg Remove software 
apt autoremove Cleanup unused 
RHEL/CentOS
Command Usage Example Description
yum install pkg Install pkg 
dnf install pkg Install pkg (newer versions) 
10. Docker Commands
Command Usage Example Description
docker ps Running containers 
docker images List images 
docker run docker run -d nginx Run container
docker logs docker logs container View logs
docker exec docker exec -it cont bash Shell inside container
docker stop Stop container 
docker rm Remove container 
docker rmi Remove image 
docker compose up -d Start Compose stack 
11. Firewall & Security
Command Usage Example Description
ufw enable Enable firewall 
ufw allow ssh Allow SSH 
ufw allow 80 Allow HTTP 
ufw status Firewall status 
iptables -L List firewall rules 
12. Git / Version Control
Command Usage Example Description
git clone Clone repo 
git pull Pull changes 
git add . Stage changes 
git commit -m "msg" Commit 
git push Push to remote 
13. System Info
Command Usage Example Description
uname -a Kernel & OS info 
hostname Show hostname 
uptime Uptime & load 
free -h Memory usage 
lscpu CPU info 
dmesg Kernel logs 
journalctl System logs 
✔️ End of Bash Cheat-Sheet
