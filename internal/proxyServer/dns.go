package proxyServer

import (
	"context"
	"errors"
	dns "github.com/sagernet/sing-dns"
	"github.com/sagernet/sing/common/metadata"
	"golang.org/x/net/proxy"
	"net"
	"time"
)

type DNSResolver struct {
	dialer    proxy.Dialer
	transport dns.Transport
	client    *dns.Client
	dnsUrl    string
}

func (D *DNSResolver) DialContext(ctx context.Context, network string, destination metadata.Socksaddr) (net.Conn, error) {
	return D.dialer.Dial(network, destination.String())
}

func (D *DNSResolver) ListenPacket(ctx context.Context, destination metadata.Socksaddr) (net.PacketConn, error) {
	return nil, nil
}

func NewDNSResolver(dialer proxy.Dialer, dnsUrl string) DNSResolver {
	client := dns.NewClient(dns.ClientOptions{
		Timeout: time.Second * 15,
	})
	resolver := DNSResolver{dnsUrl: dnsUrl}
	transport := dns.NewHTTPSTransport(dns.TransportOptions{
		Dialer:  &resolver,
		Address: dnsUrl,
	})

	resolver.dialer = dialer
	resolver.transport = transport
	resolver.client = client
	return resolver
}
func (D *DNSResolver) Resolve(ctx context.Context, name string) (context.Context, net.IP, error) {
	lookup, err := D.client.Lookup(ctx, D.transport, name, dns.QueryOptions{
		Strategy: dns.DomainStrategyPreferIPv4,
	})
	if err != nil {
		return ctx, nil, err
	}
	if len(lookup) == 0 {
		return ctx, nil, errors.New("no result")
	}
	return ctx, lookup[0].AsSlice(), nil
}
